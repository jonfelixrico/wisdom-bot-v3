import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { SubmitQuote } from 'src/domain/pending-quote/submit-quote.command'
import { PendingQuote } from 'src/domain/pending-quote/pending-quote.entity'

@CommandHandler(SubmitQuote)
export class SubmitQuoteHandler implements ICommandHandler<SubmitQuote> {
  constructor(private publisher: EventPublisher) {}
  async execute({ submittedQuote }: SubmitQuote): Promise<any> {
    const entity = PendingQuote.submit(submittedQuote)
    const pendingQuote = this.publisher.mergeObjectContext(entity)
    pendingQuote.commit()
  }
}
