import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { DiscordHelperService } from 'src/discord/discord-helper/discord-helper.service'
import { TypeormModule } from 'src/typeorm/typeorm.module'
import { QuoteSubmittedSyncEventHandlerService } from './quote-submitted-sync-event-handler/quote-submitted-sync-event-handler.service'

@Module({
  imports: [CqrsModule, DiscordHelperService, TypeormModule],
  providers: [QuoteSubmittedSyncEventHandlerService],
})
export class EventHandlersModule {}
