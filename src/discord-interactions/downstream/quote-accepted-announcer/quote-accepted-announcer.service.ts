import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { EventBus, ofType, QueryBus } from '@nestjs/cqrs'
import {
  MessageEditOptions,
  MessageEmbed,
  MessageEmbedOptions,
} from 'discord.js'
import { filter, map } from 'rxjs/operators'
import { DiscordHelperService } from 'src/discord/discord-helper/discord-helper.service'
import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { IPendingQuote } from 'src/domain/entities/pending-quote.entity'
import {
  IPendingQuoteQueryOutput,
  PendingQuoteQuery,
} from 'src/queries/pending-quote.query'
import { ReadModelSyncedEvent } from 'src/read-model-catch-up/read-model-synced.event'

@Injectable()
export class QuoteAcceptedAnnouncerService implements OnModuleInit {
  constructor(
    private eventBus: EventBus,
    private logger: Logger,
    private queryBus: QueryBus,
    private helper: DiscordHelperService,
  ) {}

  private async generateResponse({
    content,
    authorId,
    submitDt,
    submitterId,
    guildId,
  }: IPendingQuote): Promise<MessageEditOptions> {
    const { helper } = this
    const year = submitDt.getFullYear()

    const embed: MessageEmbedOptions = {
      author: {
        name: 'Quote Accepted',
        icon_url: await helper.getGuildMemberAvatarUrl(guildId, submitterId),
      },
      description: [
        `**"${content}"**`,
        `- <@${authorId}>, ${year}`,
        '',
        `Submitted by <@${submitterId}>`,
      ].join('\n'),
      thumbnail: {
        url: await helper.getGuildMemberAvatarUrl(guildId, authorId),
      },
    }

    return { embeds: [new MessageEmbed(embed)], components: [] }
  }

  private async handle(quoteId: string) {
    const { logger, helper } = this

    const quote = (await this.queryBus.execute(
      new PendingQuoteQuery({ quoteId }),
    )) as IPendingQuoteQueryOutput

    if (!quote) {
      logger.warn(`Unkown quote ${quoteId}`, QuoteAcceptedAnnouncerService.name)
      return
    }

    const { guildId, channelId, messageId } = quote

    const guild = await helper.getGuild(guildId)
    if (!guild.available) {
      logger.warn(
        `Can't announce in guild ${guildId} because we have no permissions.`,
        QuoteAcceptedAnnouncerService.name,
      )
      return
    }

    const [channel, permissions] =
      (await this.helper.getTextChannelAndPermissions(guildId, channelId)) || []

    if (!channel) {
      logger.warn(
        `Cant find channel ${channelId} of guild ${guildId}.`,
        QuoteAcceptedAnnouncerService.name,
      )
    }

    const announcementContent = await this.generateResponse(quote)

    const oldMessage = await helper.getMessage(
      guildId,
      channelId,
      messageId,
      true,
    )

    if (!oldMessage || oldMessage.deleted) {
      if (!permissions.has('SEND_MESSAGES')) {
        // TODO add logging here
        return
      }

      await channel.send(announcementContent)
      // TODO add logging here
      return
    }

    await oldMessage.edit(announcementContent)
    if (!permissions.has('SEND_MESSAGES')) {
      // TODO add logging here
      return
    }

    await oldMessage.reply({
      content: 'This quote has been accepted 🎉.',
    })
    // TODO add logging here
  }

  onModuleInit() {
    this.eventBus
      .pipe(
        ofType(ReadModelSyncedEvent),
        filter(
          ({ event }) =>
            event.eventName === DomainEventNames.PENDING_QUOTE_ACCEPTED,
        ),
        map(({ event }) => event.aggregateId),
      )
      .subscribe(this.handle.bind(this))
  }
}
