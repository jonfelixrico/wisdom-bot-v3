import { NO_STREAM } from '@eventstore/db-client'
import { Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { SubmitQuoteCommand } from 'src/domain/commands/submit-quote.command'
import { Guild } from 'src/domain/entities/guild.entity'
import { GuildWriteRepository } from 'src/write-repositories/abstract/guild-write-repository.abstract'
import { PendingQuoteWriteRepository } from 'src/write-repositories/abstract/pending-quote-write-repository.abstract'

@CommandHandler(SubmitQuoteCommand)
export class SubmitQuoteCommandHandlerService
  implements ICommandHandler<SubmitQuoteCommand>
{
  constructor(
    private logger: Logger,
    private pendingQuoteRepo: PendingQuoteWriteRepository,
    private guildRepo: GuildWriteRepository,
  ) {}

  async execute({ payload }: SubmitQuoteCommand): Promise<any> {
    const { guildId } = payload

    let guild = await this.guildRepo.findById(guildId)

    if (!guild) {
      // TODO use a separate command for this -- PRIO 1
      guild = {
        entity: Guild.register({
          guildId,
          quoteSettings: {
            // TODO edit these for production, or maybe retrieve it from syspars?
            upvoteCount: 3,
            upvoteEmoji: '🤔',
            // 7 days
            upvoteWindow: 1000 * 60 * 60 * 24 * 7,
          },
          settings: {
            embedColor: '#800080',
          },
        }),
        revision: null,
      }
    }

    const submitted = guild.entity.submitQuote(payload)
    const { quoteId } = submitted

    await this.guildRepo.publishEvents(
      guild.entity,
      guild.revision ?? NO_STREAM,
    )

    if (guild.revision === null) {
      this.logger.debug(
        `Registered guild ${guildId}.`,
        SubmitQuoteCommandHandlerService.name,
      )
    }

    await this.pendingQuoteRepo.publishEvents(submitted, NO_STREAM)

    this.logger.debug(
      `Created quote ${quoteId}.`,
      SubmitQuoteCommandHandlerService.name,
    )

    // TODO remove these commented-out code

    // const { channelId, messageId } = payload
    // const message = await this.discordHelper.getMessage(
    //   guildId,
    //   channelId,
    //   messageId,
    // )

    // await this.commandBus.execute(
    //   new WatchPendingQuoteCommand({
    //     ...submitted,
    //     message,
    //   }),
    // )
  }
}
