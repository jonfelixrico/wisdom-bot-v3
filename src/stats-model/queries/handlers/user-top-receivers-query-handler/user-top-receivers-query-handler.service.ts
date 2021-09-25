import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GuildMemberInteractionTypeormEntity } from 'src/stats-model/db/entities/guild-member-interaction.typeorm-entity'
import {
  IUserTopReceiversQueryOutput,
  UserTopReceiversQuery,
} from 'src/stats-model/queries/user-top-receivers.query'
import { Connection, MoreThan } from 'typeorm'

@QueryHandler(UserTopReceiversQuery)
export class UserTopReceiversQueryHandlerService
  implements IQueryHandler<UserTopReceiversQuery>
{
  constructor(private conn: Connection) {}

  private get repo() {
    return this.conn.getRepository(GuildMemberInteractionTypeormEntity)
  }

  async execute({
    input,
  }: UserTopReceiversQuery): Promise<IUserTopReceiversQueryOutput> {
    const { guildId, limit, userId: authorId } = input

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
