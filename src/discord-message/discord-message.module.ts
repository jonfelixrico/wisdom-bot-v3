import { Module } from '@nestjs/common'
import { dbProvider } from './db/db.provider'
import { redisProviders } from './redis/redis.providers'
import { DiscordMessageCatchUpService } from './event-sourcing/discord-message-catch-up/discord-message-catch-up.service'
import { DeleteWatcherService } from './services/delete-watcher/delete-watcher.service'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { DiscordModule } from 'src/discord/discord.module'
import { MessageRecacheRoutineService } from './services/message-recache-routine/message-recache-routine.service'
import { ThrottledMessageFetcherService } from './services/throttled-message-fetcher/throttled-message-fetcher.service'

@Module({
  imports: [EventStoreModule, DiscordModule],

  providers: [
    dbProvider,
    ...redisProviders,
    DiscordMessageCatchUpService,
    DeleteWatcherService,
    MessageRecacheRoutineService,
    ThrottledMessageFetcherService,
  ],
})
export class DiscordMessageModule {}
