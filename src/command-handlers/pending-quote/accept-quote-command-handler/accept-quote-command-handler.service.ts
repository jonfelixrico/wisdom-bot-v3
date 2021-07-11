import { Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AcceptPendingQuoteCommand } from 'src/domain/commands/accept-pending-quote.command'
import { PendingQuoteWriteRepositoryService } from 'src/write-repositories/pending-quote-write-repository/pending-quote-write-repository.service'

@CommandHandler(AcceptPendingQuoteCommand)
export class AcceptQuoteCommandHandlerService
  implements ICommandHandler<AcceptPendingQuoteCommand>
{
  constructor(
    private logger: Logger,
    private repo: PendingQuoteWriteRepositoryService,
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

    await repo.publishEvents(entity, revision)
    this.logger.log(
      `Accepted quote ${quoteId}.`,
      AcceptQuoteCommandHandlerService.name,
    )
  }
}
