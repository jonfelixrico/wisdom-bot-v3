import { Injectable } from '@nestjs/common'
import { PendingQuote } from 'src/domain/entities/pending-quote.entity'
import { ExpectedRevision } from '@eventstore/db-client'
import {
  EsdbRepository,
  IEsdbRepositoryEntity,
} from '../abstract/esdb-repository.abstract'
import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { PENDING_QUOTE_REDUCERS } from '../reducers/pending-quote.reducer'
import { reduceEvents } from '../reducers/reducer.util'
import { DomainEventPublisherService } from '../domain-event-publisher/domain-event-publisher.service'
import { EsdbHelperService } from '../esdb-helper/esdb-helper.service'

const {
  PENDING_QUOTE_ACCEPTED,
  PENDING_QUOTE_CANCELLED,
  PENDING_QUOTE_EXPIRATION_ACKNOWLEDGED,
} = DomainEventNames

const DISQUALIFIER_EVENTS = new Set<string>([
  PENDING_QUOTE_ACCEPTED,
  PENDING_QUOTE_CANCELLED,
  PENDING_QUOTE_EXPIRATION_ACKNOWLEDGED,
])

@Injectable()
export class PendingQuoteWriteRepositoryService extends EsdbRepository<PendingQuote> {
  constructor(
    private helper: EsdbHelperService,
    private pub: DomainEventPublisherService,
  ) {
    super()
  }

  async findById(id: string): Promise<IEsdbRepositoryEntity<PendingQuote>> {
    const events = await this.helper.readAllEvents(id)

    if (
      !events ||
      !events.length ||
      events.some(({ type }) => DISQUALIFIER_EVENTS.has(type))
    ) {
      return null
    }

    const [entity, revision] = reduceEvents(events, PENDING_QUOTE_REDUCERS)

    return {
      entity: new PendingQuote(entity),
      revision,
    }
  }

  async publishEvents(
    { events }: PendingQuote,
    expectedRevision: ExpectedRevision,
  ) {
    await this.pub.publishEvents(events, expectedRevision)
  }
}
