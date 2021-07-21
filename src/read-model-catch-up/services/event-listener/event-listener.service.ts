import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { EventRelayService } from '../event-relay/event-relay.service'
import { JSONRecordedEvent, RecordedEvent } from '@eventstore/db-client'
import { Connection } from 'typeorm'
import { REDUCER_MAP } from '../../reducers/index'
import { EventBus } from '@nestjs/cqrs'
import { EventConsumedEvent } from 'src/read-model-catch-up/event-consumed.event'

@Injectable()
export class EventListenerService implements OnModuleInit {
  constructor(
    private eventRelay: EventRelayService,
    private logger: Logger,
    private conn: Connection,
    private eventBus: EventBus,
  ) {}

  private async onEventEmitted(event: RecordedEvent) {
    const { type, revision, streamId, isJson } = event

    this.logger.verbose(
      `Received revision ${revision} (${type}) from stream ${streamId}`,
      EventListenerService.name,
    )
    const runner = this.conn.createQueryRunner()
    try {
      await runner.connect()
      await runner.startTransaction()

      // We're not expecting binary-type events here
      if (!isJson) {
        this.logger.warn(
          `Received binary-type event.`,
          EventListenerService.name,
        )
        return
      }

      const reducerFn = REDUCER_MAP[event.type]
      if (!reducerFn) {
        this.logger.warn(
          `No reducers found for event ${event.type}!`,
          EventListenerService.name,
        )
        return
      }

      const isProcessed = await reducerFn(
        event as JSONRecordedEvent,
        runner.manager,
      )

      if (!isProcessed) {
        this.logger.verbose(
          `Ignored revision ${revision} (${type}) from stream ${streamId}`,
          EventListenerService.name,
        )
        await runner.rollbackTransaction()
        return
      }

      await runner.commitTransaction()
      this.logger.verbose(
        `Processed revision ${revision} (${type}) from stream ${streamId}`,
        EventListenerService.name,
      )

      // We'll do this so that if ever we missed an event because this is still processing, we can catch up gradually
      this.eventRelay.queryEvent(streamId, revision + 1n)

      // This is a way to let downstream listeners that an event has been consumed by the read model
      this.eventBus.publish(new EventConsumedEvent(streamId, revision))
    } catch (e) {
      this.logger.error(
        `Uncaught exception while processing revision ${revision} of stream ${streamId}: ${e.message}`,
        e.stack,
        EventListenerService.name,
      )

      await runner.rollbackTransaction()
    } finally {
      runner.release()
    }
  }

  onModuleInit() {
    this.eventRelay.eventStream.subscribe(this.onEventEmitted.bind(this))
  }
}
