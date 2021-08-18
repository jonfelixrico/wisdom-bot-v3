import { Module } from '@nestjs/common'
import { DiscordModule } from 'src/discord/discord.module'
import { TypeormModule } from 'src/typeorm/typeorm.module'

@Module({
  imports: [TypeormModule, DiscordModule],
  providers: [
    // TODO re-enable this later on, or completely remove this
    // QuoteSubmittedSyncEventHandlerService
  ],
})
export class EventHandlersModule {}
