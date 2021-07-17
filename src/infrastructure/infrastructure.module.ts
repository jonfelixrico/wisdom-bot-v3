import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { DiscordModule } from 'src/discord/discord.module'
import { RegeneratePendingQuoteMessageCommandHandlerService } from './command-handlers/regenerate-pending-quote-message-command-handler/regenerate-pending-quote-message-command-handler.service'
import { WatchPendingQuoteCommandHandlerService } from './command-handlers/watch-pending-quote-command-handler/watch-pending-quote-command-handler.service'
import { PendingQuoteAcceptedEventHandlerService } from './event-handlers/pending-quote-accepted-event-handler/pending-quote-accepted-event-handler.service'
import { PendingQuoteExpiredEventHandlerService } from './event-handlers/pending-quote-expired-event-handler/pending-quote-expired-event-handler.service'

@Module({
  imports: [CqrsModule, DiscordModule],
  providers: [
    RegeneratePendingQuoteMessageCommandHandlerService,
    WatchPendingQuoteCommandHandlerService,
    PendingQuoteAcceptedEventHandlerService,
    PendingQuoteExpiredEventHandlerService,
  ],
})
export class InfrastructureModule {}
