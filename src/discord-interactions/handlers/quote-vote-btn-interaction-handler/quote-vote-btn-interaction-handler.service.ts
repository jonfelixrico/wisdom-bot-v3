import { Logger } from '@nestjs/common'
import {
  CommandBus,
  EventsHandler,
  IEventHandler,
  QueryBus,
} from '@nestjs/cqrs'
import { DiscordInteractionEvent } from 'src/discord-interactions/types/discord-interaction.event'
import { CastPendingQuoteVoteCommand } from 'src/domain/commands/cast-pending-quote-vote.command'
import {
  IPendingQuoteQueryOutput,
  PendingQuoteQuery,
} from 'src/queries/pending-quote.query'

const BUTTON_ID_REGEXP = /quote\/(.+)\/vote\/(-?\d+)/

const EMOJI_MAPPING = {
  1: '👍',
  2: '👎',
}

@EventsHandler(DiscordInteractionEvent)
export class QuoteVoteBtnInteractionHandlerService
  implements IEventHandler<DiscordInteractionEvent>
{
  constructor(
    private queryBus: QueryBus,
    private logger: Logger,
    private commandBus: CommandBus,
  ) {}

  async handle({ interaction }: DiscordInteractionEvent) {
    if (
      !interaction.isButton() ||
      !BUTTON_ID_REGEXP.test(interaction.customId)
    ) {
      return
    }

    const { logger } = this
    const [quoteId, valueStr] = BUTTON_ID_REGEXP.exec(
      interaction.customId,
    ).slice(1)
    const voteValue = parseInt(valueStr)
    const userId = interaction.user.id

    logger.verbose(
      `Received vote interaction from user ${userId} for quote ${quoteId}.`,
      QuoteVoteBtnInteractionHandlerService.name,
    )

    await interaction.deferReply({ ephemeral: true })

    const pendingQuote = await this.queryBus.execute<
      PendingQuoteQuery,
      IPendingQuoteQueryOutput
    >(new PendingQuoteQuery({ quoteId }))

    if (!pendingQuote) {
      logger.warn(
        `Attempted to vote for missing quote ${quoteId}.`,
        QuoteVoteBtnInteractionHandlerService.name,
      )

      await interaction.editReply(
        'Looks like the data of the quote you voted for is missing...',
      )
      return
    } else if (
      pendingQuote.acceptDt ||
      pendingQuote.expireAckDt ||
      pendingQuote.cancelDt
    ) {
      logger.warn(
        `Attempted to vote for non-pending quote ${quoteId}.`,
        QuoteVoteBtnInteractionHandlerService.name,
      )

      await interaction.editReply(
        'The quote that you voted for no longer accepts votes.',
      )
      return
    }

    // TODO ask confirmation for vote change

    await this.commandBus.execute(
      new CastPendingQuoteVoteCommand({
        quoteId,
        userId: interaction.user.id,
        voteValue,
      }),
    )

    const hasVoted = pendingQuote.votes.some((vote) => vote.userId === userId)

    if (!hasVoted) {
      logger.log(
        `User ${userId} has casted their vote for quote ${quoteId} (${voteValue})`,
        QuoteVoteBtnInteractionHandlerService.name,
      )
      await interaction.editReply(`You have voted ${EMOJI_MAPPING[voteValue]}.`)
      return
    }

    logger.log(
      `User ${userId} has changed their vote for quote ${quoteId} (${voteValue})`,
      QuoteVoteBtnInteractionHandlerService.name,
    )
    await interaction.editReply(
      `You have changed your vote to ${EMOJI_MAPPING[voteValue]}.`,
    )
  }
}
