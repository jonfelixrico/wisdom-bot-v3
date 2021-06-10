import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AcceptPendingQuote } from 'src/domain/pending-quote/accept-pending-quote.command'

@CommandHandler(AcceptPendingQuote)
export class AcceptPendingQuoteCommandHandlerService
  implements ICommandHandler<AcceptPendingQuote>
{
  execute(command: AcceptPendingQuote): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
