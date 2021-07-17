import { Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { MessageEmbed, MessageEmbedOptions } from 'discord.js'
import { DiscordHelperService } from 'src/discord/discord-helper/discord-helper.service'
import { SendQuoteAcceptedMessageCommand } from 'src/infrastructure/commands/send-quote-accepted-notification.command'

// TODO make an enum/constant for this once it gets referenced in the code again
const EMPTY_STRING = '\u200B'

@CommandHandler(SendQuoteAcceptedMessageCommand)
export class SendQuoteAcceptedNotificationCommandHandlerService
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
        SendQuoteAcceptedNotificationCommandHandlerService.name,
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
        SendQuoteAcceptedNotificationCommandHandlerService.name,
      )
    }
    // TODO add logging that indicates if deleteMessage was successful

    const embedOptions: MessageEmbedOptions = {
      title: 'Quote accepted!',
      description: `${content} - <@${authorId}>, ${year}`,
      fields: [
        {
          name: EMPTY_STRING,
          value: `Submitted by <@${submitterId}>`,
        },
      ],
    }

    const authorMemberObject = await helper.getGuildMember(guildId, authorId)
    /*
     * We're doing a null-check here because there maybe cases that the user is no longer
     * part of the guild by the time this command is triggered. The method call above will probably
     * return null.
     */
    if (authorMemberObject) {
      const avatarUrl = await authorMemberObject.user.displayAvatarURL({
        format: 'png',
      })

      embedOptions.thumbnail = {
        url: avatarUrl,
      }
    }

    return await channel.send(new MessageEmbed(embedOptions))
  }
}
