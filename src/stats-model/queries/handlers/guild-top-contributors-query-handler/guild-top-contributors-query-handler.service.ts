import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GuildMemberTypeormEntity } from 'src/stats-model/db/entities/guild-member.typeorm-entity'
import { Connection, MoreThan } from 'typeorm'
import {
  GuildTopContributorsQuery,
  IGuildTopContributorsQueryOutput,
} from '../../guild-top-contributors.query'

@QueryHandler(GuildTopContributorsQuery)
export class GuildTopContributorsQueryHandlerService
  implements IQueryHandler<GuildTopContributorsQuery>
{
  constructor(private conn: Connection) {}

  async execute({
    input,
  }: GuildTopContributorsQuery): Promise<IGuildTopContributorsQueryOutput> {
    const { guildId, limit } = input

    const contributors = await this.conn
      .getRepository(GuildMemberTypeormEntity)
      .find({
        where: {
          guildId,
          submissions: MoreThan(0),
        },
        take: limit,
        order: {
          submissions: 'DESC',
        },
      })

    return contributors.map(({ userId, submissions }) => {
      return {
        userId,
        contributions: submissions,
      }
    })
  }
}
