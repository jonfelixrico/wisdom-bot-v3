import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import {
  GuildTopReceivedAuthorsQuery,
  IGuildTopReceivedAuthorsQueryOutput,
} from 'src/queries/guild-top-received-authors.query'
import { GuildMemberInteractionTypeormEntity } from 'src/stats-model/db/entities/guild-member-interaction.typeorm-entity'
import { Connection } from 'typeorm'

interface IResult {
  authorId: string
  receives: number
}

@QueryHandler(GuildTopReceivedAuthorsQuery)
export class GuildTopReceivedAuthorsQueryHandlerService
  implements IQueryHandler<GuildTopReceivedAuthorsQuery>
{
  constructor(private conn: Connection) {}

  async execute({
    input,
  }: GuildTopReceivedAuthorsQuery): Promise<IGuildTopReceivedAuthorsQueryOutput> {
    const { guildId, limit } = input

    return await this.conn
      .getRepository(GuildMemberInteractionTypeormEntity)
      .createQueryBuilder()
      .select('"targetUserId"', 'authorId')
      .addSelect('SUM(receives)', 'receives')
      .where('"guildId" = :guildId', { guildId })
      .groupBy('"targetUserId"')
      .having('SUM(receives) > 0')
      .orderBy('receives', 'DESC')
      .limit(limit)
      .getRawMany<IResult>()
  }
}
