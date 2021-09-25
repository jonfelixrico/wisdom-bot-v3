import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GuildMemberTypeormEntity } from 'src/stats-model/db/entities/guild-member.typeorm-entity'
import {
  GuildTopReceivedAuthorsQuery,
  IGuildTopReceivedAuthorsQueryOutput,
} from 'src/stats-model/queries/guild-top-received-authors.query'
import { Connection, MoreThan } from 'typeorm'

@QueryHandler(GuildTopReceivedAuthorsQuery)
export class GuildTopReceivedAuthorsQueryHandlerService
  implements IQueryHandler<GuildTopReceivedAuthorsQuery>
{
  constructor(private conn: Connection) {}

  async execute({
    input,
  }: GuildTopReceivedAuthorsQuery): Promise<IGuildTopReceivedAuthorsQueryOutput> {
    const { guildId, limit } = input

    const topReceived = await this.conn
      .getRepository(GuildMemberTypeormEntity)
      .find({
        where: {
          guildId,
          quoteReceives: MoreThan(0),
        },
        take: limit,
        order: {
          quoteReceives: 'DESC',
        },
      })

    return topReceived.map(({ userId, quoteReceives }) => {
      return {
        authorId: userId,
        receives: quoteReceives,
      }
    })
  }
}
