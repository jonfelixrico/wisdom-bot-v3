import { Logger } from '@nestjs/common'
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DiscordHelperService } from 'src/discord/discord-helper/discord-helper.service'
import { UpdateQuoteMessageDetailsCommand } from 'src/domain/commands/update-quote-message-id.command'
import { RegeneratePendingQuoteMessageCommand } from '../../commands/regenerate-pending-quote-message.command'
import { WatchPendingQuoteCommand } from '../../commands/watch-pending-quote.command'
import { PendingQuoteQueryService } from 'src/read-repositories/queries/pending-quote-query/pending-quote-query.service'
import { SPACE_CHARACTER } from 'src/types/discord.constants'
import { MessageEmbed, MessageEmbedOptions } from 'discord.js'

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
      submitterId,
      content,
      authorId,
      upvoteEmoji,
      upvoteCount,
      expireDt,
      submitDt,
    } = quoteData

    const channel = await this.discordHelper.getTextChannel(guildId, channelId)
    if (!channel) {
      this.logger.warn(
        `Channel ${channelId} not found.`,
        RegeneratePendingQuoteMessageCommandHandlerService.name,
      )
    }

    const embed: MessageEmbedOptions = {
      title: 'Quote Submitted',
      description: [
        `**"${content}"**`,
        `- <@${authorId}>, ${new Date().getFullYear()}`,
      ].join('\n'),
      fields: [
        {
          name: SPACE_CHARACTER,
          value: `Submitted by <@${submitterId}> on ${submitDt}`,
        },
      ],
      footer: {
        text: `This submission needs ${
          upvoteCount + 1
        } ${upvoteEmoji} reacts to get reactions on or before ${expireDt}.`,
      },
      thumbnail: {
        url: await this.discordHelper.getGuildMemberAvatarUrl(
          guildId,
          authorId,
        ),
      },
    }

    const newMessage = await channel.send(new MessageEmbed(embed))
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
