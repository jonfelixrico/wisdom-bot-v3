import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { PendingQuoteRepository } from 'src/domain/pending-quote/pending-quote.repository'
import { SubmitQuote } from 'src/domain/pending-quote/submit-quote.command'

@CommandHandler(SubmitQuote)
export class SubmitQuoteCommandHandlerService
  implements ICommandHandler<SubmitQuote>
{
  constructor(
    private publisher: EventPublisher,
    private repo: PendingQuoteRepository,
  ) {}

  async execute({ payload }: SubmitQuote): Promise<any> {
    const entity = await this.repo.create(payload)
    const pendingQuote = this.publisher.mergeObjectContext(entity)
    pendingQuote.commit()
  }
}
