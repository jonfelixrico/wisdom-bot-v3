import { Logger } from '@nestjs/common'
import {
  EventsHandler,
  IEventHandler,
  IQueryHandler,
  QueryHandler,
} from '@nestjs/cqrs'
import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { EsdbLiveSubscriptionEvent } from 'src/event-store/esdb-event-publisher/esdb-live-subscription.event'
import { GetPendingQuoteByMessageIdQuery } from 'src/read-repositories/queries/get-pending-quote-by-message-id.query'

interface IEventPayload {
  messageId: string
  quoteId: string
}

@EventsHandler(EsdbLiveSubscriptionEvent)
@QueryHandler(GetPendingQuoteByMessageIdQuery)
export class GetPendingQuoteByMessageIdQueryHandlerService
  implements
    IQueryHandler<GetPendingQuoteByMessageIdQuery>,
    IEventHandler<EsdbLiveSubscriptionEvent<IEventPayload>>
{
  private messageIdToQuoteIdMapping: { [messageId: string]: string } = {}

  constructor(private logger: Logger) {}

  handle({ data, type }: EsdbLiveSubscriptionEvent<IEventPayload>) {
    if (type !== DomainEventNames.QUOTE_SUBMITTED) {
    }

    const { messageId, quoteId } = data
    this.messageIdToQuoteIdMapping[messageId] = quoteId

    this.logger.debug(
      `Mapped messageId ${messageId} to quote ${quoteId}.`,
      GetPendingQuoteByMessageIdQueryHandlerService.name,
    )
  }

  async execute({ messageId }: GetPendingQuoteByMessageIdQuery): Promise<any> {
    return this.messageIdToQuoteIdMapping[messageId]
  }
}
