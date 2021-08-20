import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { WrappedRedisClient } from 'src/discord-message-delete-watcher/utils/wrapped-redis-client.class'
import {
  IWatchedMessageQueryOutput,
  WatchedMessageQuery,
} from 'src/queries/watched-message.query'

@QueryHandler(WatchedMessageQuery)
export class WatchedMessageQueryHandlerService
  implements IQueryHandler<WatchedMessageQuery>
{
  constructor(private wrapper: WrappedRedisClient) {}

  async execute({
    input,
  }: WatchedMessageQuery): Promise<IWatchedMessageQueryOutput> {
    const { messageId } = input

    if (!messageId) {
      return null
    }

    const quoteId = await this.wrapper.get(messageId)
    return quoteId ? { quoteId, messageId } : null
  }
}
