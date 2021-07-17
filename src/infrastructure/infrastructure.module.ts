import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { DiscordModule } from 'src/discord/discord.module'
import { ReadRepositoriesModule } from 'src/read-repositories/read-repositories.module'
import { RegeneratePendingQuoteMessageCommandHandlerService } from './command-handlers/regenerate-pending-quote-message-command-handler/regenerate-pending-quote-message-command-handler.service'
import { WatchPendingQuoteCommandHandlerService } from './command-handlers/watch-pending-quote-command-handler/watch-pending-quote-command-handler.service'
import { PendingQuoteExpiredEventHandlerService } from './event-handlers/pending-quote-expired-event-handler/pending-quote-expired-event-handler.service'
import { SendQuoteAcceptedNotificationCommandHandlerService } from './command-handlers/send-quote-accepted-notification-command-handler/send-quote-accepted-notification-command-handler.service'

@Module({
  imports: [CqrsModule, DiscordModule, ReadRepositoriesModule],
  providers: [
    RegeneratePendingQuoteMessageCommandHandlerService,
    WatchPendingQuoteCommandHandlerService,
    PendingQuoteExpiredEventHandlerService,
    SendQuoteAcceptedNotificationCommandHandlerService,
  ],
})
export class InfrastructureModule {}
