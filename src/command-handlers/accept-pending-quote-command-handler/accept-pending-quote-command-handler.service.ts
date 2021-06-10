import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { AcceptPendingQuote } from 'src/domain/pending-quote/accept-pending-quote.command'
import { PendingQuoteRepository } from 'src/domain/pending-quote/pending-quote.repository'

@CommandHandler(AcceptPendingQuote)
export class AcceptPendingQuoteCommandHandlerService
  implements ICommandHandler<AcceptPendingQuote>
{
  constructor(
    private publisher: EventPublisher,
    private repo: PendingQuoteRepository,
  ) {}

  async execute({ payload: quoteId }: AcceptPendingQuote): Promise<any> {
    const fromRepo = await this.repo.findById(quoteId)

    if (!fromRepo) {
      // TODO throw handler-specific error message here
      throw new Error('Quote not found.')
    }

    const quote = this.publisher.mergeObjectContext(fromRepo)

    quote.accept()
    quote.commit()
  }
}
