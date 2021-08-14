import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { DiscordModule } from 'src/discord/discord.module'
import { TypeormModule } from 'src/typeorm/typeorm.module'

@Module({
  imports: [CqrsModule, TypeormModule, DiscordModule],
  providers: [
    // TODO re-enable this later on, or completely remove this
    // QuoteSubmittedSyncEventHandlerService
  ],
})
export class EventHandlersModule {}
