import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GuildMemberTypeormEntity } from 'src/stats-model/db/entities/guild-member.typeorm-entity'
import {
  GuildStatsQuery,
  IGuildStatsQueryOutput,
} from 'src/stats-model/queries/query-classes/guild-stats.query'
import { Connection } from 'typeorm'

type ReduceResults = Omit<IGuildStatsQueryOutput, 'guildId' | 'userCount'>

@QueryHandler(GuildStatsQuery)
export class GuildStatsQueryHandlerService
  implements IQueryHandler<GuildStatsQuery>
{
  constructor(private conn: Connection) {}

  async execute({ input }: GuildStatsQuery): Promise<IGuildStatsQueryOutput> {
    const { guildId } = input
    const { conn } = this

    const memberStats = await conn
      .getRepository(GuildMemberTypeormEntity)
      .find({
        where: { guildId },
      })

    const reduced = memberStats.reduce(
      (results, entity) => {
        results.receives += entity.receives
        results.submissions += entity.submissions
        return results
      },
      {
        receives: 0,
        submissions: 0,
      } as ReduceResults,
    )

    return {
      guildId,
      userCount: memberStats.length,
      ...reduced,
    }
  }
}
