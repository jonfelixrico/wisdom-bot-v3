import { JSONType } from '@eventstore/db-client'
import { Logger } from '@nestjs/common'
import {
  EventsHandler,
  IEventHandler,
  IQueryHandler,
  QueryHandler,
} from '@nestjs/cqrs'
import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { EsdbLiveEvent } from 'src/event-store/esdb-event-publisher/esdb-live.event'
import { GetPendingQuoteByMessageIdQuery } from 'src/read-repositories/queries/get-pending-quote-by-message-id.query'

@EventsHandler(EsdbLiveEvent)
@QueryHandler(GetPendingQuoteByMessageIdQuery)
export class GetPendingQuoteByMessageIdQueryHandlerService
  implements
    IQueryHandler<GetPendingQuoteByMessageIdQuery>,
    IEventHandler<EsdbLiveEvent>
{
  private messageIdToQuoteIdMapping: { [messageId: string]: JSONType } = {}

  constructor(private logger: Logger) {}

  handle({ data, type }: EsdbLiveEvent) {
    if (type !== DomainEventNames.QUOTE_SUBMITTED) {
    }

    this.messageIdToQuoteIdMapping[data['messageId']] = data

    this.logger.debug(
      `Mapped messageId ${data['messageId']} to quote ${data['quoteId']}.`,
      GetPendingQuoteByMessageIdQueryHandlerService.name,
    )
  }

  async execute({ messageId }: GetPendingQuoteByMessageIdQuery): Promise<any> {
    return this.messageIdToQuoteIdMapping[messageId]
  }
}
