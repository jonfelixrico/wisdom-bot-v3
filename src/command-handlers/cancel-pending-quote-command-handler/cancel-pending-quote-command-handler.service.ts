import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { CancelPendingQuote } from 'src/domain/pending-quote/cancel-pending-quote.command'
import { PendingQuoteRepository } from 'src/domain/pending-quote/pending-quote.repository'

@CommandHandler(CancelPendingQuote)
export class CancelPendingQuoteCommandHandlerService
  implements ICommandHandler<CancelPendingQuote>
{
  constructor(
    private publisher: EventPublisher,
    private repo: PendingQuoteRepository,
  ) {}

  async execute({ payload: quoteId }: CancelPendingQuote): Promise<any> {
    const fromRepo = await this.repo.findById(quoteId)

    if (!fromRepo) {
      // TODO throw handler-specific error message here
      throw new Error('Quote not found.')
    }

    const quote = this.publisher.mergeObjectContext(fromRepo)

    quote.cancel()
    quote.commit()
  }
}
