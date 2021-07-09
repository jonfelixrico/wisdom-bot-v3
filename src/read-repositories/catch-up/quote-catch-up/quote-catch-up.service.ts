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
  ErrorType,
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
import { QuoteTypeormEntity } from 'src/typeorm/entities/quote.typeorm-entity'
import { Logger } from '@nestjs/common'

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
    private logger: Logger,
  ) {}

  private async processRootEvent({
    streamId,
    data,
  }: JSONRecordedEvent<EventType>) {
    const { quoteId } = data

    try {
      await this.conn.transaction(async (manager) => {
        const quoteInDb = await manager.findOne(QuoteTypeormEntity, {
          id: quoteId,
        })

        const fromRevision = quoteInDb ? quoteInDb.revision + 1n : 0n
        this.logger.verbose(
          `Building quote ${quoteId} from revision ${fromRevision}.`,
          QuoteCatchUpService.name,
        )

        const events = await this.client.readStream<EventType>(streamId, {
          fromRevision,
        })

        if (!events.length) {
          this.logger.verbose(
            `Quote ${quoteId} is up-to-date.`,
            QuoteCatchUpService.name,
          )
          return
        }

        for (const { event } of events) {
          await REDUCER_MAPPING[event.type](event, manager)
        }

        this.logger.verbose(
          `Consumed ${events.length} events to build quote ${quoteId}.`,
        )
      })
    } catch (e) {
      this.logger.error(
        `An error was encountered while trying to build quote ${quoteId}: ${e.message}`,
        e.stack,
        QuoteCatchUpService.name,
      )
    }

    // TODO emit latest revision here to trigger minor-catch ups
  }

  async catchUp() {
    const streamName = `$et-${QUOTE_SUBMITTED}`
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
          `${streamName} not found. This may be due to the projection not being created since there's no instances of ${QUOTE_SUBMITTED} event yet, or the projection may be disabled.`,
          QuoteCatchUpService.name,
        )
      }
    }
  }

  onModuleInit() {
    this.orchestrator.register(this, 1)
  }
}
