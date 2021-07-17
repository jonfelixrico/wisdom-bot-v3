import { Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { MessageEmbed, MessageEmbedOptions } from 'discord.js'
import { DiscordHelperService } from 'src/discord/discord-helper/discord-helper.service'
import { SendQuoteAcceptedMessageCommand } from 'src/infrastructure/commands/send-quote-accepted-notification.command'
import { SPACE_CHARACTER } from 'src/types/discord.constants'

@CommandHandler(SendQuoteAcceptedMessageCommand)
export class SendQuoteAcceptedMessageCommandHandlerService
  implements ICommandHandler<SendQuoteAcceptedMessageCommand>
{
  constructor(private helper: DiscordHelperService, private logger: Logger) {}

  async execute({ payload }: SendQuoteAcceptedMessageCommand): Promise<any> {
    const {
      quote: { content, submitterId, authorId, year },
      guildId,
      channelId,
      messageId,
    } = payload

    const { helper } = this

    const channel = await helper.getTextChannel(guildId, channelId)

    if (!channel) {
      this.logger.warn(
        `Channel ${channelId} does not exist.`,
        SendQuoteAcceptedMessageCommandHandlerService.name,
      )
      return
    }

    // `messageId` is optional. If provided, then that means that we'll delete the said message
    if (messageId) {
      await helper.deleteMessage(
        guildId,
        channelId,
        // We'll assume that the message belongs to the channel in the payload
        messageId,
        'Quote got accepted.',
      )
      this.logger.debug(
        `Deleted message ${messageId}`,
        SendQuoteAcceptedMessageCommandHandlerService.name,
      )
    }
    // TODO add logging that indicates if deleteMessage was successful

    const embedOptions: MessageEmbedOptions = {
      title: 'Quote accepted!',
      description: `${content} - <@${authorId}>, ${year}`,
      fields: [
        {
          name: SPACE_CHARACTER,
          value: `Submitted by <@${submitterId}>`,
        },
      ],
    }

    const authorAvatarUrl = await helper.getGuildMemberAvatarUrl(
      guildId,
      authorId,
    )

    if (authorAvatarUrl) {
      embedOptions.thumbnail = {
        url: authorAvatarUrl,
      }
    }

    return await channel.send(new MessageEmbed(embedOptions))
  }
}
