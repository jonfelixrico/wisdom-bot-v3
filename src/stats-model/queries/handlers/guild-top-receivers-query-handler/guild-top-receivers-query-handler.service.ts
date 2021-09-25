import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GuildMemberTypeormEntity } from 'src/stats-model/db/entities/guild-member.typeorm-entity'
import {
  GuildTopReceiversQuery,
  IGuildTopReceiversQueryOutput,
} from 'src/stats-model/queries/guild-top-receivers.query'
import { Connection, MoreThan } from 'typeorm'

@QueryHandler(GuildTopReceiversQuery)
export class GuildTopReceiversQueryHandlerService
  implements IQueryHandler<GuildTopReceiversQuery>
{
  constructor(private conn: Connection) {}

  async execute({
    input,
  }: GuildTopReceiversQuery): Promise<IGuildTopReceiversQueryOutput> {
    const { guildId, limit } = input

    const topReceivers = await this.conn
      .getRepository(GuildMemberTypeormEntity)
      .find({
        where: { guildId, receives: MoreThan(0) },
        order: {
          receives: 'DESC',
        },
        take: limit,
      })

    return topReceivers.map(({ userId, receives }) => {
      return {
        userId,
        receives,
      }
    })
  }
}
