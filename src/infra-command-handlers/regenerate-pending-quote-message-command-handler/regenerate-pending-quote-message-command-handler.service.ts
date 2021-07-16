import { Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PendingQuoteWriteRepositoryService } from 'src/write-repositories/pending-quote-write-repository/pending-quote-write-repository.service'
import { RegeneratePendingQuoteMessageCommand } from '../commands/regenerate-pending-quote-message.command'

@CommandHandler(RegeneratePendingQuoteMessageCommand)
export class RegeneratePendingQuoteMessageCommandHandlerService
  implements ICommandHandler<RegeneratePendingQuoteMessageCommand>
{
  constructor(
    private writeRepo: PendingQuoteWriteRepositoryService,
    private logger: Logger,
  ) {}

  async execute({
    payload,
  }: RegeneratePendingQuoteMessageCommand): Promise<any> {
    const { quoteId } = payload

    const quote = this.writeRepo.findById(quoteId)

    if (!quote) {
      this.logger.warn(
        `Quote not found ${quoteId}`,
        RegeneratePendingQuoteMessageCommandHandlerService.name,
      )
      return null
    }

    // TODO updateMessageId command for the pending quote entity
  }
}
