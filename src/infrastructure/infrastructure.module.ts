import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { DiscordModule } from 'src/discord/discord.module'
import { ReadRepositoriesModule } from 'src/read-repositories/read-repositories.module'
import { RegeneratePendingQuoteMessageCommandHandlerService } from './command-handlers/regenerate-pending-quote-message-command-handler/regenerate-pending-quote-message-command-handler.service'
import { WatchPendingQuoteCommandHandlerService } from './command-handlers/watch-pending-quote-command-handler/watch-pending-quote-command-handler.service'
import { SendQuoteAcceptedMessageCommandHandlerService } from './command-handlers/send-quote-accepted-message-command-handler/send-quote-accepted-message-command-handler.service'
import { UpdateReceiveMessageReactionsListCommandHandlerService } from './command-handlers/update-receive-message-reactions-list-command-handler/update-receive-message-reactions-list-command-handler.service'
import { UpdateSubmitMessageAsExpiredCommandService } from './command-handlers/update-submit-message-as-expired-command/update-submit-message-as-expired-command.service'

@Module({
  imports: [CqrsModule, DiscordModule, ReadRepositoriesModule],
  providers: [
    RegeneratePendingQuoteMessageCommandHandlerService,
    WatchPendingQuoteCommandHandlerService,
    SendQuoteAcceptedMessageCommandHandlerService,
    UpdateReceiveMessageReactionsListCommandHandlerService,
    UpdateSubmitMessageAsExpiredCommandService,
  ],
})
export class InfrastructureModule {}