import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import {
  GuildTopReceivedQuotesQuery,
  IGuildTopReceivedQuotesQueryOutput,
} from 'src/queries/guild-top-received-quotes.query'
import { QuoteInfoTypeormEntity } from 'src/stats-model/typeorm/entities/quote-info.typeorm-entity'
import { Connection, MoreThan } from 'typeorm'

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
