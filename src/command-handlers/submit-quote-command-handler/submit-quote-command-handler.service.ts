import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { PendingQuote } from 'src/domain/pending-quote/pending-quote.entity'
import { SubmitQuote } from 'src/domain/pending-quote/submit-quote.command'

@CommandHandler(SubmitQuote)
export class SubmitQuoteCommandHandlerService
  implements ICommandHandler<SubmitQuote>
{
  constructor(private publisher: EventPublisher) {}

  async execute({ payload: submittedQuote }: SubmitQuote): Promise<any> {
    const entity = PendingQuote.submit(submittedQuote)
    const pendingQuote = this.publisher.mergeObjectContext(entity)
    pendingQuote.commit()
  }
}
