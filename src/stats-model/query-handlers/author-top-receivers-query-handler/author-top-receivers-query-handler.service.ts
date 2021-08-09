import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import {
  AuthorTopReceiversQuery,
  IAuthorTopReceiversQueryOutput,
} from 'src/queries/author-top-receivers.query'
import { GuildMemberInteractionTypeormEntity } from 'src/stats-model/typeorm/entities/guild-member-interaction.typeorm-entity'
import { Connection, MoreThan } from 'typeorm'

@QueryHandler(AuthorTopReceiversQuery)
export class AuthorTopContributorsQueryHandlerService
  implements IQueryHandler<AuthorTopReceiversQuery>
{
  constructor(private conn: Connection) {}

  private get repo() {
    return this.conn.getRepository(GuildMemberInteractionTypeormEntity)
  }

  async execute({
    input,
  }: AuthorTopReceiversQuery): Promise<IAuthorTopReceiversQueryOutput> {
    const { guildId, limit, authorId } = input

    const results = await this.repo.find({
      where: {
        guildId,
        targetUserId: authorId,
        receives: MoreThan(0),
      },
      take: limit,
      order: {
        // TODO create tiebreaker for same `receives` count
        receives: 'DESC',
      },
    })

    return results.map(({ userId, receives }) => {
      return {
        userId,
        receives,
      }
    })
  }
}
