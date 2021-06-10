import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CancelPendingQuote } from 'src/domain/pending-quote/cancel-pending-quote.command'

@CommandHandler(CancelPendingQuote)
export class CancelPendingQuoteCommandHandlerService
  implements ICommandHandler<CancelPendingQuote>
{
  execute(command: CancelPendingQuote): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
