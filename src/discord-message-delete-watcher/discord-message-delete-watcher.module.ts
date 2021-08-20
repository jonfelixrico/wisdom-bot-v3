import { Module } from '@nestjs/common'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { redisProviders } from './redis.providers'
import { WatchedMessagesCatchUp } from './services/watched-messages-catch-up/watched-messages-catch-up.service'
import { WatchedMessageQueryHandlerService } from './query-handlers/watched-message-query-handler/watched-message-query-handler.service'
import { DiscordModule } from 'src/discord/discord.module'

@Module({
  imports: [EventStoreModule, DiscordModule],
  providers: [
    ...redisProviders,
    WatchedMessagesCatchUp,
    WatchedMessageQueryHandlerService,
  ],
})
export class DiscordMessageDeleteWatcher {}
