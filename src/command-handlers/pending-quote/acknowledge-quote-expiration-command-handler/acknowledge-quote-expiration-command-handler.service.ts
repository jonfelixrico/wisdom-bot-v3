import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AcknowledgePendingQuoteExpirationCommand } from 'src/domain/commands/acknowledge-pending-quote-expiration.command'

@CommandHandler(AcknowledgePendingQuoteExpirationCommand)
export class AcknowledgeQuoteExpirationCommandHandlerService
  implements ICommandHandler<AcknowledgePendingQuoteExpirationCommand>
{
  execute(command: AcknowledgePendingQuoteExpirationCommand): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
