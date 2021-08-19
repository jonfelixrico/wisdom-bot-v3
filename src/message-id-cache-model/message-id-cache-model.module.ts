import { Module } from '@nestjs/common'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { redisProviders } from './redis.providers'
import { CacheCatchUpService } from './services/cache-catch-up/cache-catch-up.service'
import { WatchedMessageQueryHandlerService } from './handlers/watched-message-query-handler/watched-message-query-handler.service'

@Module({
  imports: [EventStoreModule],
  providers: [
    ...redisProviders,
    CacheCatchUpService,
    WatchedMessageQueryHandlerService,
  ],
})
export class MessageIdCacheModelModule {}
