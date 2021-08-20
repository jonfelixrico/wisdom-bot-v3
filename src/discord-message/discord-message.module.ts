import { Module } from '@nestjs/common'
import { dbProvider } from './db/db.provider'
import { redisProviders } from './redis/redis.providers'
import { DiscordMessageCatchUpService } from './event-sourcing/discord-message-catch-up/discord-message-catch-up.service'

@Module({
  providers: [dbProvider, ...redisProviders, DiscordMessageCatchUpService],
})
export class DiscordMessageModule {}
