import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RedisClient } from 'redis'
import redis from 'redis'

export const cacheRedisProvider: Provider = {
  provide: RedisClient,
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    return redis.createClient({
      url: config.get('REDIS_URL'),
      prefix: 'message-id-cache',
    })
  },
}
