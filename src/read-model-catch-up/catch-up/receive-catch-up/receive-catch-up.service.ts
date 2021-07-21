import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { StreamReaderService } from 'src/event-store/stream-reader/stream-reader.service'
import { RECEIVE_REDUCERS } from 'src/read-model-catch-up/reducers/receive.reducers'
import {
  CatchUpOrchestratorService,
  ICatchUpService,
} from '../catch-up-orchestrator/catch-up-orchestrator.service'
import { Connection } from 'typeorm'
import {
  ErrorType,
  EventStoreDBClient,
  JSONEventType,
  JSONRecordedEvent,
} from '@eventstore/db-client'
import { IReceiveCreatedPayload } from 'src/domain/events/receive-created.event'
import { ReceiveTypeormEntity } from 'src/typeorm/entities/receive.typeorm-entity'
import { EventRelayService } from 'src/read-model-catch-up/services/event-relay/event-relay.service'

const { RECEIVE_CREATED } = DomainEventNames

interface DataType extends IReceiveCreatedPayload, Record<string, any> {}
type EventType = JSONEventType<DomainEventNames, DataType>

@Injectable()
export class ReceiveCatchUpService implements OnModuleInit, ICatchUpService {
  constructor(
    private streamReader: StreamReaderService,
    private orchestrator: CatchUpOrchestratorService,
    private conn: Connection,
    private client: EventStoreDBClient,
    private logger: Logger,
    private relay: EventRelayService,
  ) {}

  private async processRootEvent({
    streamId,
    data,
  }: JSONRecordedEvent<EventType>) {
    const { receiveId } = data
    try {
      await this.conn.transaction(async (manager) => {
        const dbEntity = await manager.findOne(ReceiveTypeormEntity, {
          id: receiveId,
        })

        const fromRevision = dbEntity ? dbEntity.revision + 1n : 0n
        this.logger.verbose(
          `Building receive ${receiveId} from revision ${fromRevision}.`,
          ReceiveCatchUpService.name,
        )

        const events = await this.client.readStream<EventType>(streamId, {
          fromRevision,
        })

        if (!events.length) {
          this.logger.verbose(
            `Receive ${receiveId} is up-to-date.`,
            ReceiveCatchUpService.name,
          )

          this.relay.queryEvent(streamId, fromRevision + 1n)
          return
        }

        for (const { event } of events) {
          await RECEIVE_REDUCERS[event.type](event, manager)
        }

        this.logger.verbose(
          `Consumed ${events.length} events to build receive ${receiveId}.`,
        )
        const [lastResolvedEvent] = events.reverse()
        this.relay.queryEvent(streamId, lastResolvedEvent.event.revision + 1n)
      })
    } catch (e) {
      this.logger.error(
        `An error was encountered while trying to build receive ${receiveId}: ${e.message}`,
        e.stack,
        ReceiveCatchUpService.name,
      )
    }
  }

  async catchUp() {
    const streamName = `$et-${RECEIVE_CREATED}`
    try {
      await this.streamReader.readStream<EventType>(
        streamName,
        ({ event }) => this.processRootEvent(event),
        {
          resolveLinkTos: true,
        },
      )
    } catch (e) {
      if (e.type === ErrorType.STREAM_NOT_FOUND) {
        this.logger.warn(
          `${streamName} not found. This may be due to the projection not being created since there's no instances of ${RECEIVE_CREATED} event yet, or the projection may be disabled.`,
          ReceiveCatchUpService.name,
        )
      }
    }
  }

  onModuleInit() {
    this.orchestrator.register(this, 2)
  }
}
