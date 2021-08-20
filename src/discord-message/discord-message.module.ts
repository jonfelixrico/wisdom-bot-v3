import { Module } from '@nestjs/common'
import { dbProvider } from './db/db.provider'
import { redisProviders } from './redis/redis.providers'
import { DiscordMessageCatchUpService } from './event-sourcing/discord-message-catch-up/discord-message-catch-up.service'
import { DeleteWatcherService } from './services/delete-watcher/delete-watcher.service'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { DiscordModule } from 'src/discord/discord.module'

@Module({
  imports: [EventStoreModule, DiscordModule],

  providers: [
    dbProvider,
    ...redisProviders,
    DiscordMessageCatchUpService,
    DeleteWatcherService,
  ],
})
export class DiscordMessageModule {}
