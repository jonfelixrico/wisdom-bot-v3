import { Injectable } from '@nestjs/common'
import {
  MessageActionRow,
  MessageButton,
  MessageEditOptions,
  MessageEmbedOptions,
} from 'discord.js'
import { sumBy } from 'lodash'
import { DateTime } from 'luxon'
import { DiscordHelperService } from 'src/discord/discord-helper/discord-helper.service'
import { IPendingQuote } from 'src/domain/entities/pending-quote.entity'

const formatDate = (date: Date) =>
  DateTime.fromJSDate(date).toLocaleString(DateTime.DATETIME_FULL)

@Injectable()
export class PendingQuoteResponseGeneratorService {
  constructor(private helper: DiscordHelperService) {}

  async formatResponse(
    pendingQuote: IPendingQuote,
  ): Promise<MessageEditOptions | null> {
    const { helper } = this

    const {
      guildId,
      content,
      authorId,
      submitDt,
      votes,
      submitterId,
      expireDt,
      quoteId,
      upvoteCount,
    } = pendingQuote

    const voteCount = sumBy(votes, (v) => v.voteValue)

    const embed: MessageEmbedOptions = {
      author: {
        name: 'Quote Submitted',
        icon_url: await helper.getGuildMemberAvatarUrl(guildId, submitterId),
      },

      description: [
        `**"${content}"**`,
        `- <@${authorId}>, ${submitDt.getFullYear()}`,
        '',
        `Submitted by <@${submitterId}>`,
        '',
        `This submission needs ${upvoteCount} votes on or before ${formatDate(
          expireDt,
        )}.`,
        '',
        `**Votes received:** ${voteCount}`,
      ].join('\n'),
      footer: {
        /*
         * We're using `footer` instead of `timestamp` because the latter adjusts with the Discord client device's
         * timezone (device of a discord user). We don't want that because it'll be inconsistent with our other date-related
         * strings if ever they did change timezones.
         */
        text: `Submitted on ${formatDate(expireDt)}`,
      },
      thumbnail: {
        url: await helper.getGuildMemberAvatarUrl(guildId, authorId),
      },
    }

    const row = new MessageActionRow({
      components: [
        new MessageButton({
          customId: `quote/${quoteId}/vote/1`,
          style: 'SUCCESS',
          emoji: '👍',
        }),
        new MessageButton({
          customId: `quote/${quoteId}/vote/-1`,
          style: 'DANGER',
          emoji: '👎',
        }),
      ],
    })

    return { embeds: [embed], components: [row] }
  }
}
