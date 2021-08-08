import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import {
  GuildTopContributorsQuery,
  IGuildTopContributorsQueryOutput,
} from 'src/queries/guild-top-contributors.query'
import { GuildMemberInteractionTypeormEntity } from 'src/stats-model/typeorm/entities/guild-member-interaction.typeorm-entity'
import { Connection } from 'typeorm'

interface IResult {
  userId: string
  contributions: number
}

@QueryHandler(GuildTopContributorsQuery)
export class GuildTopContributorsQueryHandlerService
  implements IQueryHandler<GuildTopContributorsQuery>
{
  constructor(private conn: Connection) {}

  get repo() {
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
      .orderBy('submitted', 'DESC')
      .limit(limit)
      .getRawMany<IResult>()

    return results
  }
}
