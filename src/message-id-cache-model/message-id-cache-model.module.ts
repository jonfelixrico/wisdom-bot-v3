import { Module } from '@nestjs/common'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { redisProviders } from './redis.providers'
import { CacheCatchUpService } from './services/cache-catch-up/cache-catch-up.service'

@Module({
  imports: [EventStoreModule],
  providers: [...redisProviders, CacheCatchUpService],
})
export class MessageIdCacheModelModule {}
