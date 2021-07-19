import { MessageEmbedOptions } from 'discord.js'
import { SPACE_CHARACTER } from 'src/types/discord.constants'

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
    title: 'Quote submitted!',
    description: [
      `**"${content}"**`,
      `- <@${authorId}>, ${new Date().getFullYear()}`,
    ].join('\n'),
    fields: [
      {
        name: SPACE_CHARACTER,
        value: [
          `Submitted by <@${submitterId}> on ${submitDt}`,
          `_This submission needs ${reactionCount} ${reactionEmoji} reacts to get reactions on or before ${expireDt}._`,
        ].join('\n\n'),
      },
    ],
    timestamp: submitDt,
  }

  if (authorAvatarUrl) {
    embed.thumbnail = { url: authorAvatarUrl }
  }

  if (submitterAvatarUrl) {
    embed.author = { iconURL: submitterAvatarUrl }
  }

  return embed
}
