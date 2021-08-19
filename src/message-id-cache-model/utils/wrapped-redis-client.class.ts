import { RedisClient } from 'redis'
import { promisify } from 'util'

export class WrappedRedisClient {
  readonly get: (key: string) => Promise<string>
  readonly set: (key: string, value: string) => Promise<unknown>

  private constructor(readonly client: RedisClient) {
    this.get = promisify(client.get).bind(client)
    this.set = promisify(client.set).bind(client)
  }

  static wrapClient(client: RedisClient) {
    return new WrappedRedisClient(client)
  }
}
