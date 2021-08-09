import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import {
  AuthorTopReceivedQuotesQuery,
  IAuthorTopReceivedQuotesQueryOutput,
} from 'src/queries/author-top-received-quotes.query'
import { QuoteInfoTypeormEntity } from 'src/stats-model/typeorm/entities/quote-info.typeorm-entity'
import { Connection, MoreThan } from 'typeorm'

@QueryHandler(AuthorTopReceivedQuotesQuery)
export class AuthorTopReceivedQuotesQueryHandlerService
  implements IQueryHandler<AuthorTopReceivedQuotesQuery>
{
  constructor(private conn: Connection) {}

  async execute({
    input,
  }: AuthorTopReceivedQuotesQuery): Promise<IAuthorTopReceivedQuotesQueryOutput> {
    const { guildId, limit, authorId } = input

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
