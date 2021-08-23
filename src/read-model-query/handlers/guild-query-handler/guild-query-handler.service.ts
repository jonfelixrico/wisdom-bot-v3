import { Logger } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GuildQuery, IGuildQueryOuptut } from 'src/queries/guild.query'
import { GuildTypeormEntity } from 'src/typeorm/entities/guild.typeorm-entity'
import { Connection } from 'typeorm'

@QueryHandler(GuildQuery)
export class GuildQueryHandlerService implements IQueryHandler<GuildQuery> {
  constructor(private conn: Connection, private logger: Logger) {}

  private get repo() {
    return this.conn.getRepository(GuildTypeormEntity)
  }

  async execute({ input }: GuildQuery): Promise<IGuildQueryOuptut> {
    const { repo, logger } = this
    const { guildId, existingOnly } = input

    logger.debug(
      `Processing query for guild ${guildId}`,
      GuildQueryHandlerService.name,
    )

    const guild = await repo.findOne({ where: { id: guildId } })

    if (guild) {
      const { quoteSettings, settings } = guild
      logger.debug(`Found guild ${guildId}`, GuildQueryHandlerService.name)

      return {
        quoteSettings,
        settings,
        doesExist: true,
      }
    } else if (!guild && existingOnly) {
      logger.debug(
        `Guild ${guildId} not found; returning null due to the existingOnly flag.`,
        GuildQueryHandlerService.name,
      )
      return null
    }

    logger.debug(
      `Guild ${guildId} not found, returning defaults instead.`,
      GuildQueryHandlerService.name,
    )

    return {
      // TODO create service for default guild values
      quoteSettings: {
        upvoteCount: 3,
        upvoteEmoji: '🤔',
        // 7 days
        upvoteWindow: 1000 * 60 * 60 * 24 * 7,
      },
      settings: {
        embedColor: '#800080',
      },
    }
  }
}
