import { Logger } from '@nestjs/common'
import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import { DiscordInteractionEvent } from 'src/discord-interactions/types/discord-interaction.event'
import {
  IPendingQuoteQueryOutput,
  PendingQuoteQuery,
} from 'src/queries/pending-quote.query'

const BUTTON_ID_REGEXP = /quote\/(.+)\/vote\/(-?\d+)/

@EventsHandler(DiscordInteractionEvent)
export class QuoteVoteBtnInteractionHandlerService
  implements IEventHandler<DiscordInteractionEvent>
{
  constructor(private queryBus: QueryBus, private logger: Logger) {}

  async handle({ interaction }: DiscordInteractionEvent) {
    if (
      !interaction.isButton() ||
      !BUTTON_ID_REGEXP.test(interaction.customId)
    ) {
      return
    }

    const [quoteId, valueStr] = BUTTON_ID_REGEXP.exec(
      interaction.customId,
    ).slice(1)
    const voteValue = parseInt(valueStr)

    await interaction.deferReply({ ephemeral: true })

    const { logger } = this

    const pendingQuote = await this.queryBus.execute<
      PendingQuoteQuery,
      IPendingQuoteQueryOutput
    >(new PendingQuoteQuery({ quoteId }))

    if (!pendingQuote) {
      logger.warn(
        `Attempted to vote for missing quote ${quoteId}.`,
        QuoteVoteBtnInteractionHandlerService.name,
      )
      return await interaction.editReply(
        'Looks like the data of the quote you voted for is missing...',
      )
    } else if (
      pendingQuote.acceptDt ||
      pendingQuote.expireAckDt ||
      pendingQuote.cancelDt
    ) {
      logger.warn(
        `Attempted to vote for non-pending quote ${quoteId}.`,
        QuoteVoteBtnInteractionHandlerService.name,
      )
      return await interaction.editReply(
        'The quote that you voted for no longer accepts votes.',
      )
    }

    // TODO add continuation for the vote logic here
  }
}
