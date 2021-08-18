import { Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CastPendingQuoteVoteCommand } from 'src/domain/commands/cast-pending-quote-vote.command'
import { PendingQuoteWriteRepository } from 'src/write-repositories/abstract/pending-quote-write-repository.abstract'

@CommandHandler(CastPendingQuoteVoteCommand)
export class CastPendingQuoteVoteCommandHandlerService
  implements ICommandHandler<CastPendingQuoteVoteCommand>
{
  constructor(
    private logger: Logger,
    private repo: PendingQuoteWriteRepository,
  ) {}

  async execute({ payload }: CastPendingQuoteVoteCommand) {
    const { quoteId, userId, voteValue } = payload
    const { logger, repo } = this

    const { entity: pendingQuote, revision } =
      (await repo.findById(quoteId)) || {}

    if (!pendingQuote) {
      logger.warn(
        `Attempted to cast vote for nonexistent/non-pending quote ${quoteId}`,
        CastPendingQuoteVoteCommand.name,
      )
      return null
    }

    if (pendingQuote.checkIfHasVoted(userId)) {
      logger.verbose(
        `User ${userId} is changing their vote for ${quoteId}.`,
        CastPendingQuoteVoteCommandHandlerService.name,
      )

      pendingQuote.withdrawVote(userId)
    }

    pendingQuote.castVote({ userId, voteValue })

    await repo.publishEvents(pendingQuote, revision)
    logger.log(
      `User ${userId} has casted their vote for quote ${quoteId}`,
      CastPendingQuoteVoteCommandHandlerService.name,
    )
  }
}
