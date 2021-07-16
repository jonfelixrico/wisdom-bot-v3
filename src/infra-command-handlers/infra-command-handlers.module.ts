import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { DiscordModule } from 'src/discord/discord.module'
import { RegeneratePendingQuoteMessageCommandHandlerService } from './regenerate-pending-quote-message-command-handler/regenerate-pending-quote-message-command-handler.service'

@Module({
  imports: [CqrsModule, DiscordModule],
  providers: [RegeneratePendingQuoteMessageCommandHandlerService],
})
export class InfraCommandHandlersModule {}
