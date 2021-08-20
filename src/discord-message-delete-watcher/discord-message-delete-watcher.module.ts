import { Module } from '@nestjs/common'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { redisProviders } from './redis.providers'
import { WatchedMessagesCatchUp } from './services/watched-messages-catch-up/watched-messages-catch-up.service'
import { WatchedMessageQueryHandlerService } from './query-handlers/watched-message-query-handler/watched-message-query-handler.service'
import { DiscordModule } from 'src/discord/discord.module'
import { DeleteWatcherService } from './services/delete-watcher/delete-watcher.service'

@Module({
  imports: [EventStoreModule, DiscordModule],
  providers: [
    ...redisProviders,
    WatchedMessagesCatchUp,
    WatchedMessageQueryHandlerService,
    DeleteWatcherService,
  ],
})
export class DiscordMessageDeleteWatcher {}
