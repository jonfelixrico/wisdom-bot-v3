import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GuildMemeberTypeormEntity } from 'src/stats-model/db/entities/guild-member.typeorm-entity'
import { Connection } from 'typeorm'
import {
  GuildStatsQuery,
  IGuildStatsQueryOutput,
} from '../../guild-stats.query'

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
      .getRepository(GuildMemeberTypeormEntity)
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
