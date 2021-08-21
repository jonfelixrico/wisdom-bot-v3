import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { QuoteInfoTypeormEntity } from 'src/stats-model/db/entities/quote-info.typeorm-entity'
import { Connection, MoreThan } from 'typeorm'
import {
  GuildTopReceivedQuotesQuery,
  IGuildTopReceivedQuotesQueryOutput,
} from '../../guild-top-received-quotes.query'

@QueryHandler(GuildTopReceivedQuotesQuery)
export class GuildTopReceivedQuotesQueryHandlerService
  implements IQueryHandler<GuildTopReceivedQuotesQuery>
{
  constructor(private conn: Connection) {}

  async execute({
    input,
  }: GuildTopReceivedQuotesQuery): Promise<IGuildTopReceivedQuotesQueryOutput> {
    const { guildId, limit } = input

    const results = await this.conn.getRepository(QuoteInfoTypeormEntity).find({
      take: limit,
      where: { guildId, receives: MoreThan(0) },
      order: {
        receives: 'DESC',
      },
    })

    return results.map(({ content, authorId, receives, quoteId }) => {
      return {
        content,
        authorId,
        receives,
        quoteId,
      }
    })
  }
}
