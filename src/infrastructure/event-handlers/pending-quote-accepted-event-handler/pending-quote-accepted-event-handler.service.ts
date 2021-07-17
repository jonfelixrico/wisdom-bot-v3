import { Logger } from '@nestjs/common'
import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { MessageEmbed } from 'discord.js'
import { DiscordHelperService } from 'src/discord/discord-helper/discord-helper.service'
import { PendingQuoteAcceptedEvent } from 'src/infrastructure/events/pending-quote-accepted.event'
import { QuoteQueryService } from 'src/read-repositories/queries/quote-query/quote-query.service'

const EMPTY_STRING = '\u200B'

@EventsHandler(PendingQuoteAcceptedEvent)
export class PendingQuoteAcceptedEventHandlerService
  implements IEventHandler<PendingQuoteAcceptedEvent>
{
  constructor(
    private query: QuoteQueryService,
    private helper: DiscordHelperService,
    private logger: Logger,
  ) {}

  async handle({ payload }: PendingQuoteAcceptedEvent) {
    const { quoteId } = payload
    const quote = await this.query.getQuoteData(quoteId)

    if (!quote) {
      this.logger.warn(
        `Quote ${quoteId} does not exist.`,
        PendingQuoteAcceptedEventHandlerService.name,
      )
      return
    }

    const { helper } = this
    const {
      guildId,
      channelId,
      messageId,
      content,
      submitterId,
      authorId,
      year,
    } = quote

    const channel = await helper.getTextChannel(guildId, channelId)

    if (!channel) {
      this.logger.warn(
        `Channel ${channelId} does not exist.`,
        PendingQuoteAcceptedEventHandlerService.name,
      )
      return
    }

    await helper.deleteMessage(guildId, channelId, messageId)
    // TODO add logging that indicates if deleteMessage was successful

    const embeddedMessage = new MessageEmbed({
      title: 'Quote accepted!',
      description: `${content} - <@${authorId}>, ${year}`,
      fields: [
        {
          name: EMPTY_STRING,
          value: `Submitted by <@${submitterId}>`,
        },
      ],
    })

    return await channel.send(embeddedMessage)
  }
}
