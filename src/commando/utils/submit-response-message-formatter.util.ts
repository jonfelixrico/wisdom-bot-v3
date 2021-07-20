import { MessageEmbedOptions } from 'discord.js'
import { SPACE_CHARACTER } from 'src/types/discord.constants'
import { DateTime } from 'luxon'

function convertDateToString(date: Date) {
  return DateTime.fromJSDate(date)
    .setZone('Asia/Manila')
    .toLocaleString(DateTime.DATETIME_FULL)
}

interface IResponseData {
  content: string
  authorId: string
  submitterId: string
  submitDt: Date
  reactionCount: number
  reactionEmoji: string
  expireDt: Date
  submitterAvatarUrl?: string
  authorAvatarUrl?: string
}

export function submitResponseMessageFormatter({
  content,
  authorId,
  submitterId,
  submitDt,
  reactionEmoji,
  reactionCount,
  expireDt,
  authorAvatarUrl,
  submitterAvatarUrl,
}: IResponseData) {
  const embed: MessageEmbedOptions = {
    author: {
      name: 'Quote Submitted',
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
          `This submission needs ${reactionCount} ${reactionEmoji} reacts to get reactions on or before ${convertDateToString(
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

  if (authorAvatarUrl) {
    embed.thumbnail = { url: authorAvatarUrl }
  }

  if (submitterAvatarUrl) {
    embed.author.icon_url = submitterAvatarUrl
  }

  return embed
}
