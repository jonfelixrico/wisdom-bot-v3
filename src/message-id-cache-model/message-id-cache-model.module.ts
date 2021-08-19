import { Module } from '@nestjs/common'
import { cacheRedisProvider } from './cache-redis.provider'
import { CacheCatchUpService } from './services/cache-catch-up/cache-catch-up.service'

@Module({
  providers: [cacheRedisProvider, CacheCatchUpService],
})
export class MessageIdCacheModelModule {}
