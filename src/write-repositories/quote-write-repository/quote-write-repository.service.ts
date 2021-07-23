import { ExpectedRevision } from '@eventstore/db-client'
import { Injectable } from '@nestjs/common'
import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { Quote } from 'src/domain/entities/quote.entity'
import { QUOTE_REDUCERS } from './../reducers/quote.reducer'
import {
  EsdbRepository,
  IEsdbRepositoryEntity,
} from '../abstract/esdb-repository.abstract'
import { reduceEvents } from '../reducers/reducer.util'
import { DomainEventPublisherService } from '../domain-event-publisher/domain-event-publisher.service'
import { EsdbHelperService } from '../esdb-helper/esdb-helper.service'

@Injectable()
export class QuoteWriteRepositoryService extends EsdbRepository<Quote> {
  constructor(
    private pub: DomainEventPublisherService,
    private helper: EsdbHelperService,
  ) {
    super()
  }

  async findById(id: string): Promise<IEsdbRepositoryEntity<Quote>> {
    const events = await this.helper.readAllEvents(id)

    if (
      !events ||
      !events.some(
        ({ type }) => type === DomainEventNames.PENDING_QUOTE_ACCEPTED,
      )
    ) {
      /*
       * If PENDING_QUOTE_ACCEPTED was not found, then this quote has not reached the accepted status. Hence, the Quote
       * entity for this id technically doesn't exist yet.
       */
      return null
    }

    const [entity, revision] = reduceEvents(events, QUOTE_REDUCERS)

    return {
      entity: new Quote(entity),
      revision,
    }
  }

  async publishEvents(
    entity: Quote,
    expectedRevision: ExpectedRevision,
  ): Promise<void> {
    this.pub.publishEvents(entity.events, expectedRevision)
  }
}
