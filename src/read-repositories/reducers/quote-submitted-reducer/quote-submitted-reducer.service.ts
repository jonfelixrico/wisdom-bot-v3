import { Logger } from '@nestjs/common'
import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { IQuoteSubmittedEventPayload } from 'src/domain/events/quote-submitted.event'
import { ReadRepositoryEsdbEvent } from 'src/read-repositories/read-repository-esdb.event'
import { QuoteTypeormRepository } from 'src/typeorm/providers/quote.typeorm-repository'
import { DomainEventNames } from 'src/domain/domain-event-names.enum'

@EventsHandler(ReadRepositoryEsdbEvent)
export class QuoteSubmittedReducerService
  implements
    IEventHandler<ReadRepositoryEsdbEvent<IQuoteSubmittedEventPayload>>
{
  constructor(private logger: Logger, private repo: QuoteTypeormRepository) {}

  async handle({
    type,
    data,
    revision,
  }: ReadRepositoryEsdbEvent<IQuoteSubmittedEventPayload>) {
    if (type !== DomainEventNames.QUOTE_SUBMITTED) {
      // TODO add logging here
      return
    }

    const { quoteId } = data

    const quote = await this.repo.findOne({
      id: quoteId,
    })

    if (quote) {
      // TODO add logging here
      return
    }

    const {
      authorId,
      channelId,
      content,
      expireDt,
      guildId,
      messageId,
      submitterId,
      upvoteCount,
      upvoteEmoji,
    } = data

    await this.repo.save({
      id: quoteId,
      authorId,
      channelId,
      content,
      expireDt,
      esdb: { revision },
      guildId,
      messageId,
      submitterId,
      upvoteCount,
      upvoteEmoji,
    })

    // TODO make this message better, more descriptive
    this.logger.verbose(`Processed ${type}`, QuoteSubmittedReducerService.name)
  }
}
