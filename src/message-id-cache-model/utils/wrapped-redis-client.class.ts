import { RedisClient } from 'redis'
import { promisify } from 'util'

export class WrappedRedisClient {
  readonly get: (key: string) => Promise<string>

  private constructor(readonly client: RedisClient) {
    this.get = promisify(client.get).bind(client)
  }

  static wrapClient(client: RedisClient) {
    return new WrappedRedisClient(client)
  }
}
