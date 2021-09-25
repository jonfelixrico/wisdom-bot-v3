import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { QuoteInfoTypeormEntity } from 'src/stats-model/db/entities/quote-info.typeorm-entity'
import {
  IUserTopAuthoredQuotesQueryOutput,
  UserTopAuthoredQuotesQuery,
} from 'src/stats-model/queries/query-classes/user-top-received-quotes.query'
import { Connection, MoreThan } from 'typeorm'

@QueryHandler(UserTopAuthoredQuotesQuery)
export class UserTopAuthoredQuotesQueryHandlerService
  implements IQueryHandler<UserTopAuthoredQuotesQuery>
{
  constructor(private conn: Connection) {}

  async execute({
    input,
  }: UserTopAuthoredQuotesQuery): Promise<IUserTopAuthoredQuotesQueryOutput> {
    const { guildId, limit, userId: authorId } = input

    const results = await this.conn.getRepository(QuoteInfoTypeormEntity).find({
      take: limit,
      where: { guildId, receives: MoreThan(0), authorId },
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
