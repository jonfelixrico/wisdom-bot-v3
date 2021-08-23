import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GuildMemberInteractionTypeormEntity } from 'src/stats-model/db/entities/guild-member-interaction.typeorm-entity'
import { Connection, MoreThan } from 'typeorm'
import {
  UserTopReceiversQuery,
  IUserTopReceiversQueryOutput,
} from '../../user-top-receivers.query'

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
