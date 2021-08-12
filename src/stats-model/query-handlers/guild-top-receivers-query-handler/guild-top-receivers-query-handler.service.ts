import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GuildTopReceiversQuery } from 'src/queries/guild-top-receivers.query'
import { GuildMemberInteractionTypeormEntity } from 'src/stats-model/typeorm/entities/guild-member-interaction.typeorm-entity'
import { Connection } from 'typeorm'

interface IResult {
  userId: string
  receives: number
}

@QueryHandler(GuildTopReceiversQuery)
export class GuildTopReceiversQueryHandlerService
  implements IQueryHandler<GuildTopReceiversQuery>
{
  constructor(private conn: Connection) {}

  private get repo() {
    return this.conn.getRepository(GuildMemberInteractionTypeormEntity)
  }

  async execute({ input }: GuildTopReceiversQuery): Promise<any> {
    const { guildId, limit } = input

    const results = await this.repo
      .createQueryBuilder()
      .select('"userId"')
      .addSelect('SUM("receives")', 'receives')
      .where('"guildId" = :guildId', { guildId })
      .groupBy('"userId"')
      .having('SUM("receives") > 0')
      .orderBy('receives', 'DESC')
      .limit(limit)
      .getRawMany<IResult>()

    return results
  }
}
