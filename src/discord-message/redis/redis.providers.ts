import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RedisClient } from 'redis'
import { createClient } from 'redis'
import { WrappedRedisClient } from '../utils/wrapped-redis-client.class'

export const redisProviders: Provider[] = [
  {
    provide: RedisClient,
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      return createClient({
        url: config.get('REDIS_URL'),
        prefix: 'discord-messages:',
      })
    },
  },
  {
    provide: WrappedRedisClient,
    inject: [RedisClient],
    useFactory: (client: RedisClient) => WrappedRedisClient.wrapClient(client),
  },
]
