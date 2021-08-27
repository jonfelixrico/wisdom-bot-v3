import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { CommandBus, EventBus, ofType, QueryBus } from '@nestjs/cqrs'
import {
  Client,
  InteractionWebhook,
  MessageActionRow,
  MessageButton,
  MessageEditOptions,
  MessageEmbedOptions,
} from 'discord.js'
import { sumBy } from 'lodash'
import { DateTime } from 'luxon'
import { debounceTime, filter, groupBy, mergeMap } from 'rxjs/operators'
import { DiscordHelperService } from 'src/discord/discord-helper/discord-helper.service'
import { UpdateQuoteMessageDetailsCommand } from 'src/domain/commands/update-quote-message-details.command'
import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import {
  IPendingQuoteQueryOutput,
  PendingQuoteQuery,
} from 'src/queries/pending-quote.query'
import { ReadModelSyncedEvent } from 'src/read-model-catch-up/read-model-synced.event'

const formatDate = (date: Date) =>
  DateTime.fromJSDate(date).toLocaleString(DateTime.DATETIME_FULL)

const {
  PENDING_QUOTE_VOTE_WITHDRAWN,
  PENDING_QUOTE_VOTE_CASTED,
  PENDING_QUOTE_ACCEPTED,
  PENDING_QUOTE_CANCELLED,
  PENDING_QUOTE_EXPIRATION_ACKNOWLEDGED,
  QUOTE_SUBMITTED,
} = DomainEventNames

const UPDATABLE_EVENTS = new Set<string>([
  PENDING_QUOTE_VOTE_CASTED,
  PENDING_QUOTE_VOTE_WITHDRAWN,
  QUOTE_SUBMITTED,
])

// events that ends a quote's pending status
const DEAD_END_EVENTS = new Set<string>([
  PENDING_QUOTE_ACCEPTED,
  PENDING_QUOTE_CANCELLED,
  PENDING_QUOTE_EXPIRATION_ACKNOWLEDGED,
])

@Injectable()
export class PendingQuoteMessageUpdater implements OnModuleInit {
  constructor(
    private eventBus: EventBus,
    private queryBus: QueryBus,
    private logger: Logger,
    private helper: DiscordHelperService,
    private discord: Client,
    private commandBus: CommandBus,
  ) {}

  async generateResponse(
    pendingQuote: IPendingQuoteQueryOutput,
  ): Promise<MessageEditOptions> {
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

  private async handleInteractionToken(quote: IPendingQuoteQueryOutput) {
    const { discord } = this

    const { quoteId, channelId, interactionToken } = quote

    const webhook = new InteractionWebhook(
      discord,
      discord.application.id,
      interactionToken,
    )

    const message = await webhook.send(await this.generateResponse(quote))

    await this.commandBus.execute(
      new UpdateQuoteMessageDetailsCommand({
        quoteId,
        channelId,
        messageId: message.id,
      }),
    )
  }

  private async refreshDisplayedMessage(quoteId: string) {
    const { logger, helper } = this

    logger.debug(
      `Updating message for quote ${quoteId}`,
      PendingQuoteMessageUpdater.name,
    )

    const pendingQuote = (await this.queryBus.execute(
      new PendingQuoteQuery({ quoteId }),
    )) as IPendingQuoteQueryOutput

    if (!pendingQuote) {
      logger.warn(
        `Attempted to update message for unknown quote ${quoteId}`,
        PendingQuoteMessageUpdater.name,
      )
      return
    }

    const { channelId, messageId, guildId, interactionToken } = pendingQuote

    if (interactionToken && !messageId) {
      await this.handleInteractionToken(pendingQuote)
      return
    }

    const guild = await helper.getGuild(guildId)

    if (!guild.available) {
      logger.warn(
        `Guild ${guildId} is inaccessible. Can't update.`,
        PendingQuoteMessageUpdater.name,
      )
      return
    }

    const [channel, permissions] =
      (await helper.getTextChannelAndPermissions(guildId, channelId)) || []

    if (!channel) {
      logger.warn(
        `Channel ${channelId} not found. Can't update.`,
        PendingQuoteMessageUpdater.name,
      )
      return
    }

    if (!permissions.has('READ_MESSAGE_HISTORY')) {
      logger.warn(
        `No history read rights for ${channelId}. Can't update.`,
        PendingQuoteMessageUpdater.name,
      )
      return
    }

    const message = await helper.getMessage(guildId, channelId, messageId)
    if (!message) {
      logger.warn(
        `Attempted cannot find message ${messageId} for quote ${quoteId}`,
        PendingQuoteMessageUpdater.name,
      )
      return
    }

    if (!message.editable || message.deleted) {
      logger.warn(
        `Message ${messageId} can no longer be updated.`,
        PendingQuoteMessageUpdater.name,
      )
      return
    }

    const generatedResponse = await this.generateResponse(pendingQuote)

    await message.edit(generatedResponse)

    logger.verbose(
      `Updated the displayed message for quote ${quoteId}`,
      PendingQuoteMessageUpdater.name,
    )
  }

  onModuleInit() {
    this.eventBus
      .pipe(
        ofType(ReadModelSyncedEvent),
        filter(
          ({ event }) =>
            UPDATABLE_EVENTS.has(event.eventName) ||
            DEAD_END_EVENTS.has(event.eventName),
        ),
        groupBy(({ event }) => event.aggregateId),
        mergeMap((e) => {
          return e.pipe(debounceTime(3000))
        }),
      )
      .subscribe(async ({ event }) => {
        if (DEAD_END_EVENTS.has(event.eventName)) {
          return
        }

        await this.refreshDisplayedMessage(event.aggregateId)
      })
  }
}
