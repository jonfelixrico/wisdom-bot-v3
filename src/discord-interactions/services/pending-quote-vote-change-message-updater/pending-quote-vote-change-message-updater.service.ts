import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { EventBus, ofType, QueryBus } from '@nestjs/cqrs'
import {
  MessageActionRow,
  MessageButton,
  MessageEmbedOptions,
} from 'discord.js'
import { sumBy } from 'lodash'
import { DateTime } from 'luxon'
import { debounceTime, filter, groupBy, map, mergeMap } from 'rxjs/operators'
import { DiscordHelperService } from 'src/discord/discord-helper/discord-helper.service'
import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import {
  IPendingQuoteQueryOutput,
  PendingQuoteQuery,
} from 'src/queries/pending-quote.query'
import { ReadModelSyncedEvent } from 'src/read-model-catch-up/read-model-synced.event'

const {
  PENDING_QUOTE_VOTE_WITHDRAWN: PEDNING_QUOTE_VOTE_WITHDRAWN,
  PENDING_QUOTE_VOTE_CASTED,
} = DomainEventNames

const TARGET_EVENTS = new Set<string>([
  PENDING_QUOTE_VOTE_CASTED,
  PEDNING_QUOTE_VOTE_WITHDRAWN,
])

@Injectable()
export class PendingQuoteVoteChangeMessageUpdaterService
  implements OnModuleInit
{
  constructor(
    private eventBus: EventBus,
    private queryBus: QueryBus,
    private logger: Logger,
    private helper: DiscordHelperService,
  ) {}

  private async refreshDisplayedMessage(quoteId: string) {
    const { logger, helper } = this

    logger.debug(
      `Updating message for quote ${quoteId}`,
      PendingQuoteVoteChangeMessageUpdaterService.name,
    )

    const pendingQuote = (await this.queryBus.execute(
      new PendingQuoteQuery({ quoteId }),
    )) as IPendingQuoteQueryOutput

    if (!pendingQuote) {
      logger.warn(
        `Attempted to update message for unknown quote ${quoteId}`,
        PendingQuoteVoteChangeMessageUpdaterService.name,
      )
      return
    }

    const {
      channelId,
      messageId,
      guildId,
      content,
      authorId,
      submitDt,
      votes,
      submitterId,
      upvoteCount,
      expireDt,
    } = pendingQuote

    const message = await helper.getMessage(guildId, channelId, messageId)
    if (!message) {
      logger.warn(
        `Attempted cannot find message ${messageId} for quote ${quoteId}`,
        PendingQuoteVoteChangeMessageUpdaterService.name,
      )
      return
    }

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
        `This submission needs ${upvoteCount} votes on or before ${DateTime.fromJSDate(
          expireDt,
        ).toLocaleString(DateTime.DATETIME_FULL)}.`,
        '',
        `**Votes received:** ${voteCount}`,
      ].join('\n'),
      footer: {
        /*
         * We're using `footer` instead of `timestamp` because the latter adjusts with the Discord client device's
         * timezone (device of a discord user). We don't want that because it'll be inconsistent with our other date-related
         * strings if ever they did change timezones.
         */
        text: `Submitted on ${DateTime.fromJSDate(submitDt).toLocaleString(
          DateTime.DATETIME_FULL,
        )}`,
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

    await message.edit({ embeds: [embed], components: [row] })

    logger.verbose(
      `Updated the displayed message for quote ${quoteId}`,
      PendingQuoteVoteChangeMessageUpdaterService.name,
    )
  }

  onModuleInit() {
    this.eventBus
      .pipe(
        ofType(ReadModelSyncedEvent),
        filter(({ event }) => TARGET_EVENTS.has(event.eventName)),
        groupBy(({ event }) => event.aggregateId),
        mergeMap((e) => {
          return e.pipe(
            debounceTime(1000),
            map(({ event }) => event.aggregateId),
          )
        }),
      )
      .subscribe(this.refreshDisplayedMessage.bind(this))
  }
}
