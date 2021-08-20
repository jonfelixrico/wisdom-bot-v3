import { Module } from '@nestjs/common'
import { dbProvider } from './db/db.provider'
import { redisProviders } from './redis/redis.providers'
import { DiscordMessageCatchUpService } from './event-sourcing/discord-message-catch-up/discord-message-catch-up.service'
import { WatchedMessageQueryHandlerService } from './query/handlers/watched-message-query-handler/watched-message-query-handler.service'
import { DeleteWatcherService } from './services/delete-watcher/delete-watcher.service'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { DiscordModule } from 'src/discord/discord.module'

@Module({
  imports: [EventStoreModule, DiscordModule],

  providers: [
    dbProvider,
    ...redisProviders,
    DiscordMessageCatchUpService,
    WatchedMessageQueryHandlerService,
    DeleteWatcherService,
  ],
})
export class DiscordMessageModule {}
