import { Module } from '@nestjs/common'
import { dbProvider } from './db/db.provider'
import { redisProviders } from './redis/redis.providers'

@Module({
  providers: [dbProvider, ...redisProviders],
})
export class DiscordMessageModule {}
