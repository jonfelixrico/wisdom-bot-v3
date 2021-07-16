import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { WatchPendingQuoteCommand } from '../../commands/watch-pending-quote.command'

@CommandHandler(WatchPendingQuoteCommand)
export class WatchPendingQuoteCommandHandlerService
  implements ICommandHandler<WatchPendingQuoteCommand>
{
  execute(command: WatchPendingQuoteCommand): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
