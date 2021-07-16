import { Logger } from '@nestjs/common'
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { GuildRepoService } from 'src/discord/guild-repo/guild-repo.service'
import { UpdateQuoteMessageIdCommand } from 'src/domain/commands/update-quote-message-id.command'
import { RegeneratePendingQuoteMessageCommand } from '../commands/regenerate-pending-quote-message.command'
import { WatchPendingQuoteCommand } from '../commands/watch-pending-quote.command'

@CommandHandler(RegeneratePendingQuoteMessageCommand)
export class RegeneratePendingQuoteMessageCommandHandlerService
  implements ICommandHandler<RegeneratePendingQuoteMessageCommand>
{
  constructor(
    private logger: Logger,
    private guildRepo: GuildRepoService,
    private commandBus: CommandBus,
  ) {}

  async execute({
    payload,
  }: RegeneratePendingQuoteMessageCommand): Promise<any> {
    const { quoteId, upvoteEmoji, upvoteCount, expireDt, guildId, channelId } =
      payload

    const channel = await this.guildRepo.getTextChannel(guildId, channelId)
    if (!channel) {
      this.logger.warn(
        `Channel ${channelId} not found.`,
        RegeneratePendingQuoteMessageCommandHandlerService.name,
      )
    }

    const newMessage = await channel.send('regeneration message')

    await this.commandBus.execute(
      new UpdateQuoteMessageIdCommand({
        quoteId,
        messageId: newMessage.id,
      }),
    )

    await this.commandBus.execute(
      new WatchPendingQuoteCommand({
        message: newMessage,
        quoteId,
        expireDt,
        upvoteCount,
        upvoteEmoji,
      }),
    )

    this.logger.verbose(
      `Finished processing quote ${quoteId}`,
      RegeneratePendingQuoteMessageCommandHandlerService.name,
    )
  }
}
