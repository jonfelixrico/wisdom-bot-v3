import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { StreamReaderService } from 'src/event-store/stream-reader/stream-reader.service'
import {
  receiveCreated,
  receiveInteracted,
} from 'src/read-repositories/reducers/receive.reducers'
import { ReadRepositoryReducer } from 'src/read-repositories/types/read-repository-reducer.type'
import {
  CatchUpOrchestratorService,
  ICatchUpService,
} from '../catch-up-orchestrator/catch-up-orchestrator.service'
import { Connection } from 'typeorm'
import {
  EventStoreDBClient,
  JSONEventType,
  JSONRecordedEvent,
} from '@eventstore/db-client'
import { IReceiveCreatedPayload } from 'src/domain/events/receive-created.event'
import { ReceiveTypeormEntity } from 'src/typeorm/entities/receive.typeorm-entity'

interface DataType extends IReceiveCreatedPayload, Record<string, any> {}
type EventType = JSONEventType<DomainEventNames, DataType>

const { RECEIVE_CREATED, RECEIVE_INTERACTED } = DomainEventNames

const REDUCER_MAPPING: { [key: string]: ReadRepositoryReducer } = {
  [RECEIVE_CREATED]: receiveCreated,
  [RECEIVE_INTERACTED]: receiveInteracted,
}

@Injectable()
export class ReceiveCatchUpService implements OnModuleInit, ICatchUpService {
  constructor(
    private streamReader: StreamReaderService,
    private orchestrator: CatchUpOrchestratorService,
    private conn: Connection,
    private client: EventStoreDBClient,
    private logger: Logger,
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
          return
        }

        for (const { event } of events) {
          await REDUCER_MAPPING[event.type](event, manager)
        }

        this.logger.verbose(
          `Consumed ${events.length} events to build receive ${receiveId}.`,
        )
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
    await this.streamReader.readStream<EventType>(
      `$et-${RECEIVE_CREATED}`,
      ({ event }) => this.processRootEvent(event),
      {
        resolveLinkTos: true,
      },
    )
  }

  onModuleInit() {
    this.orchestrator.register(this, 2)
  }
}
