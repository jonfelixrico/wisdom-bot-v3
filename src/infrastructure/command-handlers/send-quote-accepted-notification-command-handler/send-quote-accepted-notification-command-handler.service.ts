import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { SendQuoteAcceptedNotificationCommand } from 'src/infrastructure/commands/send-quote-accepted-notification.command'

@CommandHandler(SendQuoteAcceptedNotificationCommand)
export class SendQuoteAcceptedNotificationCommandHandlerService
  implements ICommandHandler<SendQuoteAcceptedNotificationCommand>
{
  execute(command: SendQuoteAcceptedNotificationCommand): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
