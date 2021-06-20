import { Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AcceptPendingQuoteCommand } from 'src/domain/pending-quote/accept-pending-quote.command'
import { PendingQuoteEsdbRepository } from 'src/write-repositories/abstract/pending-quote-esdb-repository.abstract'

@CommandHandler(AcceptPendingQuoteCommand)
export class AcceptQuoteCommandHandlerService
  implements ICommandHandler<AcceptPendingQuoteCommand>
{
  constructor(
    private logger: Logger,
    private repo: PendingQuoteEsdbRepository,
  ) {}

  async execute({ payload: quoteId }: AcceptPendingQuoteCommand): Promise<any> {
    const { repo } = this
    const { entity, revision } = await repo.findById(quoteId)

    if (!entity) {
      this.logger.debug(
        `Attempted to accept nonexistent quote ${quoteId}.`,
        AcceptQuoteCommandHandlerService.name,
      )
      throw new Error(`Quote ${quoteId} not found.`)
    }

    entity.accept()
    await repo.publishEntityEvents(entity, revision)
    this.logger.log(
      `Accepted quote ${quoteId}.`,
      AcceptQuoteCommandHandlerService.name,
    )
  }
}
