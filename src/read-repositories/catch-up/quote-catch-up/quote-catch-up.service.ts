import { OnModuleInit } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { StreamReaderService } from 'src/event-store/stream-reader/stream-reader.service'
import {
  CatchUpOrchestratorService,
  ICatchUpService,
} from '../catch-up-orchestrator/catch-up-orchestrator.service'
import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { IQuoteSubmittedEventPayload } from 'src/domain/events/quote-submitted.event'
import {
  EventStoreDBClient,
  JSONEventType,
  JSONRecordedEvent,
} from '@eventstore/db-client'
import { Connection } from 'typeorm'
import {
  pendingQuoteAccepted,
  quoteReceived,
  pendingQuoteCancelled,
  quoteSubmitted,
} from 'src/read-repositories/reducers/quote.reducers'
import { ReadRepositoryReducer } from 'src/read-repositories/types/read-repository-reducer.type'

interface DataType extends IQuoteSubmittedEventPayload, Record<string, any> {}
type EventType = JSONEventType<DomainEventNames, DataType>

const {
  QUOTE_SUBMITTED,
  QUOTE_RECEIVED,
  PENDING_QUOTE_ACCEPTED,
  PENDING_QUOTE_CANCELLED,
} = DomainEventNames

const REDUCER_MAPPING: { [key: string]: ReadRepositoryReducer } = {
  [QUOTE_RECEIVED]: quoteReceived,
  [QUOTE_SUBMITTED]: quoteSubmitted,
  [PENDING_QUOTE_ACCEPTED]: pendingQuoteAccepted,
  [PENDING_QUOTE_CANCELLED]: pendingQuoteCancelled,
}

@Injectable()
export class QuoteCatchUpService implements OnModuleInit, ICatchUpService {
  constructor(
    private streamReader: StreamReaderService,
    private orchestrator: CatchUpOrchestratorService,
    private conn: Connection,
    private client: EventStoreDBClient,
  ) {}

  private async processEvent({ streamId }: JSONRecordedEvent<EventType>) {
    const events = await this.client.readStream<EventType>(streamId)
    this.conn.transaction(async (manager) => {
      for (const { event } of events) {
        await REDUCER_MAPPING[event.type](event, manager)
      }
    })
  }

  async catchUp() {
    await this.streamReader.readStream<EventType>(
      /*
       * We're getting the projection for all QUOTE_SUBMITTED events.
       * The reason why we're using QUOTE_SUBMITTED specifically because this is the "entry point" for all quote-related
       * entities.
       */
      `$et-${DomainEventNames.QUOTE_SUBMITTED}`,
      ({ event }) => this.processEvent(event),
      {
        // This is required when using projections so that it'll link the events of that projection to the actual event from other streams
        resolveLinkTos: true,
      },
    )
  }

  onModuleInit() {
    this.orchestrator.register(this, 1)
  }
}
