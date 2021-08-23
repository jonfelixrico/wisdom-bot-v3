import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import {
  UserTopContributorsQuery,
  IUserTopContributorsQueryOutput,
} from 'src/stats-model/queries/user-top-contributors.query'
import { GuildMemberInteractionTypeormEntity } from 'src/stats-model/db/entities/guild-member-interaction.typeorm-entity'
import { Connection, MoreThan } from 'typeorm'

@QueryHandler(UserTopContributorsQuery)
export class UserTopContributorsQueryHandlerService
  implements IQueryHandler<UserTopContributorsQuery>
{
  constructor(private conn: Connection) {}

  private get repo() {
    return this.conn.getRepository(GuildMemberInteractionTypeormEntity)
  }

  async execute({
    input,
  }: UserTopContributorsQuery): Promise<IUserTopContributorsQueryOutput> {
    const { guildId, limit, userId: authorId } = input

    const results = await this.repo.find({
      where: {
        guildId,
        targetUserId: authorId,
        submissions: MoreThan(0),
      },
      take: limit,
      order: {
        // TODO create tiebreaker for same `submitted` count
        submissions: 'DESC',
      },
    })

    return results.map(({ userId, submissions: submitted }) => {
      return {
        userId,
        contributions: submitted,
      }
    })
  }
}
