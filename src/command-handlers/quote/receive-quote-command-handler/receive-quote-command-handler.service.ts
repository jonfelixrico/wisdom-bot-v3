import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { ReceiveQuote } from 'src/domain/quote/receive-quote.command'
import { QuoteRepository } from 'src/domain/quote/quote.repository'

@CommandHandler(ReceiveQuote)
export class ReceiveQuoteCommandHandlerService
  implements ICommandHandler<ReceiveQuote>
{
  constructor(private pub: EventPublisher, private repo: QuoteRepository) {}

  async execute({ payload }: ReceiveQuote): Promise<any> {
    const fromRepo = await this.repo.findById(payload.quoteId)

    if (!fromRepo) {
      // TODO create custom error
      throw new Error('Quote not found.')
    }

    const quote = this.pub.mergeObjectContext(fromRepo)
    quote.receive(payload)
    quote.commit()
  }
}
