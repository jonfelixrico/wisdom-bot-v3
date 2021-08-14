import { Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { MessageEmbed, MessageEmbedOptions } from 'discord.js'
import { DiscordHelperService } from 'src/discord/discord-helper/discord-helper.service'
import { UpdateSubmitMessageAsExpiredCommand } from 'src/infrastructure/commands/update-submit-message-to-expired.command'
import { SPACE_CHARACTER } from 'src/types/discord.constants'

import { DateTime } from 'luxon'

function convertDateToString(date: Date) {
  return DateTime.fromJSDate(date)
    .setZone('Asia/Manila')
    .toLocaleString(DateTime.DATETIME_FULL)
}

/**
 * The purpose of this command handler is to update the bot's response to a submitted quote so that
 * the users can have feedback that the quote has already expired.
 */
@CommandHandler(UpdateSubmitMessageAsExpiredCommand)
export class UpdateSubmitMessageAsExpiredCommandService
  implements ICommandHandler<UpdateSubmitMessageAsExpiredCommand>
{
  constructor(private helper: DiscordHelperService, private logger: Logger) {}

  async execute({
    payload,
  }: UpdateSubmitMessageAsExpiredCommand): Promise<any> {
    const { messageId, channelId, guildId } = payload

    const message = await this.helper.getMessage(guildId, channelId, messageId)
    if (!message) {
      this.logger.verbose(
        `Wasn't able to find message ${messageId}.`,
        UpdateSubmitMessageAsExpiredCommandService.name,
      )
    }

    const {
      authorId,
      content,
      submitDt,
      submitterId,
      upvoteEmoji,
      upvoteCount,
      expireDt,
    } = payload

    const embed: MessageEmbedOptions = {
      author: {
        name: 'Quote Expired',
      },
      description: [
        `**"${content}"**`,
        `- <@${authorId}>, ${submitDt.getFullYear()}`,
      ].join('\n'),
      fields: [
        {
          name: SPACE_CHARACTER,
          value: [
            `Submitted by <@${submitterId}>`,
            `This quote has been rejected because it did not reach ${
              upvoteCount + 1
            } ${upvoteEmoji} reactions before ${convertDateToString(
              expireDt,
            )}.`,
          ].join('\n\n'),
        },
      ],
      footer: {
        /*
         * We're using `footer` instead of `timestamp` because the latter adjusts with the Discord client device's
         * timezone (device of a discord user). We don't want that because it'll be inconsistent with our other date-related
         * strings if ever they did change timezones.
         */
        text: `Submitted on ${convertDateToString(submitDt)}`,
      },
    }

    const authorAvatarUrl = await this.helper.getGuildMemberAvatarUrl(
      guildId,
      authorId,
    )

    const submitterAvatarUrl = await this.helper.getGuildMemberAvatarUrl(
      guildId,
      submitterId,
    )

    if (authorAvatarUrl) {
      embed.thumbnail = { url: authorAvatarUrl }
    }

    if (submitterAvatarUrl) {
      embed.author.icon_url = submitterAvatarUrl
    }

    await message.edit({
      embeds: [new MessageEmbed(embed)],
    })
    this.logger.verbose(
      `Updated message ${messageId}.`,
      UpdateSubmitMessageAsExpiredCommandService.name,
    )
  }
}
