import { Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AcknowledgePendingQuoteExpirationCommand } from 'src/domain/commands/acknowledge-pending-quote-expiration.command'
import { PendingQuoteWriteRepository } from 'src/write-repositories/abstract/pending-quote-write-repository.abstract'

@CommandHandler(AcknowledgePendingQuoteExpirationCommand)
export class AcknowledgeQuoteExpirationCommandHandlerService
  implements ICommandHandler<AcknowledgePendingQuoteExpirationCommand>
{
  constructor(
    private repo: PendingQuoteWriteRepository,
    private logger: Logger,
  ) {}

  async execute({
    payload,
  }: AcknowledgePendingQuoteExpirationCommand): Promise<any> {
    const { quoteId } = payload

    const result = await this.repo.findById(quoteId)

    if (!result) {
      this.logger.warn(
        `Quote ${quoteId} not found.`,
        AcknowledgeQuoteExpirationCommandHandlerService.name,
      )
      return
    }

    const { entity, revision } = result

    entity.acknowledgeExpiration()
    await this.repo.publishEvents(entity, revision)

    this.logger.verbose(
      `Flagged quote ${quoteId} as expired.`,
      AcknowledgePendingQuoteExpirationCommand.name,
    )
  }
}
