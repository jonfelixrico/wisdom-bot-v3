import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GuildStatsTypeormEntity } from 'src/stats-model/db/entities/guild-stats.typeorm-entity'
import { Connection } from 'typeorm'
import {
  GuildStatsQuery,
  IGuildStatsQueryOutput,
} from '../../guild-stats.query'

@QueryHandler(GuildStatsQuery)
export class GuildStatsQueryHandlerService
  implements IQueryHandler<GuildStatsQuery>
{
  constructor(private conn: Connection) {}

  async execute({ input }: GuildStatsQuery): Promise<IGuildStatsQueryOutput> {
    const { guildId } = input
    const { conn } = this

    const guild = await conn.getRepository(GuildStatsTypeormEntity).findOne({
      where: { guildId },
    })

    return guild || null
  }
}
