import { Logger } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import {
  GuildChannelPendingQuotesQuery,
  IGuildChannelPendingQuotesQueryOutput,
} from 'src/queries/guild-channel-pending-quotes.query'
import { QuoteTypeormEntity } from 'src/typeorm/entities/quote.typeorm-entity'
import { Connection, IsNull } from 'typeorm'

@QueryHandler(GuildChannelPendingQuotesQuery)
export class GuildChannelPendingQuotesQueryHandlerService
  implements IQueryHandler<GuildChannelPendingQuotesQuery>
{
  constructor(private conn: Connection, private logger: Logger) {}

  async execute({
    input,
  }: GuildChannelPendingQuotesQuery): Promise<IGuildChannelPendingQuotesQueryOutput> {
    const { channelId, guildId } = input

    const pendingQuotes = await this.conn
      .getRepository(QuoteTypeormEntity)
      .find({
        where: {
          channelId,
          guildId,

          acceptDt: IsNull(),
          cancelDt: IsNull(),
          expireAckDt: IsNull(),
        },
      })

    this.logger.debug(
      `Found ${pendingQuotes.length} pending quotes in guild ${guildId} @ channel ${channelId}`,
      GuildChannelPendingQuotesQueryHandlerService.name,
    )

    return pendingQuotes.map(({ id, ...quote }) => {
      return {
        ...quote,
        quoteId: id,
      }
    })
  }
}
