import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GuildMemberInteractionTypeormEntity } from 'src/stats-model/db/entities/guild-member-interaction.typeorm-entity'
import { Connection } from 'typeorm'
import {
  GuildTopContributorsQuery,
  IGuildTopContributorsQueryOutput,
} from '../../guild-top-contributors.query'

interface IResult {
  userId: string
  contributions: number
}

@QueryHandler(GuildTopContributorsQuery)
export class GuildTopContributorsQueryHandlerService
  implements IQueryHandler<GuildTopContributorsQuery>
{
  constructor(private conn: Connection) {}

  private get repo() {
    return this.conn.getRepository(GuildMemberInteractionTypeormEntity)
  }

  async execute({
    input,
  }: GuildTopContributorsQuery): Promise<IGuildTopContributorsQueryOutput> {
    const { guildId, limit } = input

    const results = await this.repo
      .createQueryBuilder()
      .select('"userId"')
      .addSelect('SUM("submitted")', 'contributions')
      .where('"guildId" = :guildId', { guildId })
      .groupBy('"userId"')
      .having('SUM("submitted") > 0')
      .orderBy('contributions', 'DESC')
      .limit(limit)
      .getRawMany<IResult>()

    return results
  }
}
