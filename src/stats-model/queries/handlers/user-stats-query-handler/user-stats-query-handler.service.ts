import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { omit } from 'lodash'
import { GuildMemberTypeormEntity } from 'src/stats-model/db/entities/guild-member.typeorm-entity'
import { Connection } from 'typeorm'
import { IUserStatsQueryOutput, UserStatsQuery } from '../../user-stats.query'

@QueryHandler(UserStatsQuery)
export class UserStatsQueryHandlerService
  implements IQueryHandler<UserStatsQuery>
{
  constructor(private conn: Connection) {}

  async execute({ input }: UserStatsQuery): Promise<IUserStatsQueryOutput> {
    const { userId, guildId } = input
    const { conn } = this

    const stats = await conn
      .getRepository(GuildMemberTypeormEntity)
      .findOne({ userId, guildId })

    if (!stats) {
      return {
        ...input,
        receives: 0,
        submissions: 0,
      }
    }

    return omit(stats, 'id')
  }
}
