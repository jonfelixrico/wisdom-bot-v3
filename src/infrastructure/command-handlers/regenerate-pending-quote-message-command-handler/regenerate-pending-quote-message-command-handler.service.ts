import { Logger } from '@nestjs/common'
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DiscordHelperService } from 'src/discord/discord-helper/discord-helper.service'
import { UpdateQuoteMessageDetailsCommand } from 'src/domain/commands/update-quote-message-details.command'
import { RegeneratePendingQuoteMessageCommand } from '../../commands/regenerate-pending-quote-message.command'
import { WatchPendingQuoteCommand } from '../../commands/watch-pending-quote.command'
import { MessageEmbed } from 'discord.js'
import { submitResponseMessageFormatter } from 'src/commando/utils/submit-response-message-formatter.util'
import { PendingQuoteQueryService } from 'src/read-model-query/pending-quote-query/pending-quote-query.service'

@CommandHandler(RegeneratePendingQuoteMessageCommand)
export class RegeneratePendingQuoteMessageCommandHandlerService
  implements ICommandHandler<RegeneratePendingQuoteMessageCommand>
{
  constructor(
    private logger: Logger,
    private discordHelper: DiscordHelperService,
    private commandBus: CommandBus,
    private query: PendingQuoteQueryService,
  ) {}

  async execute({
    payload,
  }: RegeneratePendingQuoteMessageCommand): Promise<any> {
    const { quoteId } = payload

    const quoteData = await this.query.getPendingQuote(quoteId)
    if (!quoteData) {
      this.logger.warn(
        `Quote ${quoteId} not found.`,
        RegeneratePendingQuoteMessageCommandHandlerService.name,
      )
      return
    }

    const {
      channelId,
      guildId,
      upvoteEmoji,
      upvoteCount,
      expireDt,
      submitterId,
      authorId,
    } = quoteData

    const channel = await this.discordHelper.getTextChannel(guildId, channelId)
    if (!channel) {
      this.logger.warn(
        `Channel ${channelId} not found.`,
        RegeneratePendingQuoteMessageCommandHandlerService.name,
      )
    }

    const embed = submitResponseMessageFormatter({
      ...quoteData,
      reactionEmoji: upvoteEmoji,
      reactionCount: upvoteCount,
      authorAvatarUrl: await this.discordHelper.getGuildMemberAvatarUrl(
        guildId,
        authorId,
      ),
      submitterAvatarUrl: await this.discordHelper.getGuildMemberAvatarUrl(
        guildId,
        submitterId,
      ),
    })

    const newMessage = await channel.send({
      embeds: [new MessageEmbed(embed)],
    })

    await newMessage.react(upvoteEmoji)

    await this.commandBus.execute(
      new UpdateQuoteMessageDetailsCommand({
        quoteId,
        messageId: newMessage.id,
        channelId: newMessage.channel.id,
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
