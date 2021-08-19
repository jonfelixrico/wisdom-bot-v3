import { Module } from '@nestjs/common'
import { redisProviders } from './redis.providers'
import { CacheCatchUpService } from './services/cache-catch-up/cache-catch-up.service'

@Module({
  providers: [...redisProviders, CacheCatchUpService],
})
export class MessageIdCacheModelModule {}
