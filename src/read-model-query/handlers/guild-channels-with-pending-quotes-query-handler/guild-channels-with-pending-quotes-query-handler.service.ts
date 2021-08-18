import { Logger } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import {
  GuildChannelsWithPendingQuotesQuery,
  IGuildChannelsWithPendingQuotesQueryOutput,
} from 'src/queries/guild-channels-with-pending-quotes.query'
import { PendingQuotesTrackerTypeormEntity } from 'src/typeorm/entities/pending-quotes-tracker.typeorm-entity'
import { Connection, MoreThan } from 'typeorm'

@QueryHandler(GuildChannelsWithPendingQuotesQuery)
export class GuildChannelsWithPendingQuotesQueryHandlerService
  implements IQueryHandler<GuildChannelsWithPendingQuotesQuery>
{
  constructor(private conn: Connection, private logger: Logger) {}

  async execute(): Promise<IGuildChannelsWithPendingQuotesQueryOutput> {
    const guildChannels = await this.conn
      .getRepository(PendingQuotesTrackerTypeormEntity)
      .find({ where: { count: MoreThan(0) } })

    this.logger.debug(
      `Found ${guildChannels.length} guild channels with pending quotes.`,
      GuildChannelsWithPendingQuotesQueryHandlerService.name,
    )

    return guildChannels.map(({ guildId, channelId }) => {
      return {
        guildId,
        channelId,
      }
    })
  }
}
