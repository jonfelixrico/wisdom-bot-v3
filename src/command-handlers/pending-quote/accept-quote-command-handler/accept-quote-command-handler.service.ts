import { Logger } from '@nestjs/common'
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs'
import { AcceptPendingQuoteCommand } from 'src/domain/commands/accept-pending-quote.command'
import { PendingQuoteAcceptedEvent } from 'src/infrastructure/events/pending-quote-accepted.event'
import { PendingQuoteWriteRepositoryService } from 'src/write-repositories/pending-quote-write-repository/pending-quote-write-repository.service'

@CommandHandler(AcceptPendingQuoteCommand)
export class AcceptQuoteCommandHandlerService
  implements ICommandHandler<AcceptPendingQuoteCommand>
{
  constructor(
    private logger: Logger,
    private repo: PendingQuoteWriteRepositoryService,
    private eventBus: EventBus,
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

    this.eventBus.publish(new PendingQuoteAcceptedEvent({ quoteId }))
  }
}
