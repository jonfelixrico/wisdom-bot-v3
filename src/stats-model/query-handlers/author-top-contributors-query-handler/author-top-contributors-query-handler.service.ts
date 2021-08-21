import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import {
  AuthorTopContributorsQuery,
  IAuthorTopContributorsQueryOutput,
} from 'src/queries/author-top-contributor.query'
import { GuildMemberInteractionTypeormEntity } from 'src/stats-model/db/entities/guild-member-interaction.typeorm-entity'
import { Connection, MoreThan } from 'typeorm'

@QueryHandler(AuthorTopContributorsQuery)
export class AuthorTopContributorsQueryHandlerService
  implements IQueryHandler<AuthorTopContributorsQuery>
{
  constructor(private conn: Connection) {}

  private get repo() {
    return this.conn.getRepository(GuildMemberInteractionTypeormEntity)
  }

  async execute({
    input,
  }: AuthorTopContributorsQuery): Promise<IAuthorTopContributorsQueryOutput> {
    const { guildId, limit, authorId } = input

    const results = await this.repo.find({
      where: {
        guildId,
        targetUserId: authorId,
        submitted: MoreThan(0),
      },
      take: limit,
      order: {
        // TODO create tiebreaker for same `submitted` count
        submitted: 'DESC',
      },
    })

    return results.map(({ userId, submitted }) => {
      return {
        userId,
        contributions: submitted,
      }
    })
  }
}
