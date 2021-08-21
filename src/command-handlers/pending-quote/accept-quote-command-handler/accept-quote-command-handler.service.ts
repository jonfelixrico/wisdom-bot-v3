import { Logger } from '@nestjs/common'
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AcceptPendingQuoteCommand } from 'src/domain/commands/accept-pending-quote.command'
import { PendingQuoteWriteRepository } from 'src/write-repositories/abstract/pending-quote-write-repository.abstract'

@CommandHandler(AcceptPendingQuoteCommand)
export class AcceptQuoteCommandHandlerService
  implements ICommandHandler<AcceptPendingQuoteCommand>
{
  constructor(
    private logger: Logger,
    private repo: PendingQuoteWriteRepository,
    private commandBus: CommandBus,
  ) {}

  async execute({ payload: quoteId }: AcceptPendingQuoteCommand): Promise<any> {
    const { repo } = this
    const result = await repo.findById(quoteId)

    if (!result) {
      this.logger.debug(
        `Attempted to accept nonexistent quote ${quoteId}.`,
        AcceptQuoteCommandHandlerService.name,
      )
      throw new Error(`Quote ${quoteId} not found.`)
    }

    const { entity, revision } = result

    entity.accept()

    await repo.publishEvents(entity, revision)
    this.logger.log(
      `Accepted quote ${quoteId}.`,
      AcceptQuoteCommandHandlerService.name,
    )
  }
}
