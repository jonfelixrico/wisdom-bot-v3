import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { PendingQuoteRepository } from 'src/domain/pending-quote/pending-quote.repository'
import { SubmitQuoteCommand } from 'src/domain/pending-quote/submit-quote.command'

@CommandHandler(SubmitQuoteCommand)
export class SubmitQuoteCommandHandlerService
  implements ICommandHandler<SubmitQuoteCommand>
{
  constructor(
    private publisher: EventPublisher,
    private repo: PendingQuoteRepository,
  ) {}

  async execute({ payload }: SubmitQuoteCommand): Promise<any> {
    const entity = await this.repo.create(payload)
    const pendingQuote = this.publisher.mergeObjectContext(entity)
    pendingQuote.commit()
  }
}
