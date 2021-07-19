import { NO_STREAM } from '@eventstore/db-client'
import { Logger } from '@nestjs/common'
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DiscordHelperService } from 'src/discord/discord-helper/discord-helper.service'
import { SubmitQuoteCommand } from 'src/domain/commands/submit-quote.command'
import { PendingQuote } from 'src/domain/entities/pending-quote.entity'
import { WatchPendingQuoteCommand } from 'src/infrastructure/commands/watch-pending-quote.command'
import { PendingQuoteWriteRepositoryService } from 'src/write-repositories/pending-quote-write-repository/pending-quote-write-repository.service'

@CommandHandler(SubmitQuoteCommand)
export class SubmitQuoteCommandHandlerService
  implements ICommandHandler<SubmitQuoteCommand>
{
  constructor(
    private logger: Logger,
    private repo: PendingQuoteWriteRepositoryService,
    private discordHelper: DiscordHelperService,
    private commandBus: CommandBus,
  ) {}

  async execute({ payload }: SubmitQuoteCommand): Promise<any> {
    const submitted = PendingQuote.submit(payload)
    const { quoteId } = submitted

    await this.repo.publishEvents(submitted, NO_STREAM)

    this.logger.debug(
      `Created quote ${quoteId}.`,
      SubmitQuoteCommandHandlerService.name,
    )

    const { guildId, channelId, messageId } = payload
    const message = await this.discordHelper.getMessage(
      guildId,
      channelId,
      messageId,
    )

    await this.commandBus.execute(
      new WatchPendingQuoteCommand({
        quoteId,
        ...payload,
        message,
      }),
    )
  }
}
