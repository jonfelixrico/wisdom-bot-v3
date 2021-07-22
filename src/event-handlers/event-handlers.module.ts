import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { DiscordModule } from 'src/discord/discord.module'
import { TypeormModule } from 'src/typeorm/typeorm.module'
import { QuoteSubmittedSyncEventHandlerService } from './quote-submitted-sync-event-handler/quote-submitted-sync-event-handler.service'

@Module({
  imports: [CqrsModule, TypeormModule, DiscordModule],
  providers: [QuoteSubmittedSyncEventHandlerService],
})
export class EventHandlersModule {}
