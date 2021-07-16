import { Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UpdateQuoteMessageIdCommand } from 'src/domain/commands/update-quote-message-id.command'
import { PendingQuoteWriteRepositoryService } from 'src/write-repositories/pending-quote-write-repository/pending-quote-write-repository.service'

@CommandHandler(UpdateQuoteMessageIdCommand)
export class UpdateQuoteMessageIdCommandHandlerService
  implements ICommandHandler<UpdateQuoteMessageIdCommand>
{
  constructor(
    private repo: PendingQuoteWriteRepositoryService,
    private logger: Logger,
  ) {}

  async execute({ payload }: UpdateQuoteMessageIdCommand): Promise<any> {
    const { quoteId, messageId } = payload

    const result = await this.repo.findById(quoteId)
    if (!result) {
      this.logger.warn(
        `Quote ${quoteId} not found.`,
        UpdateQuoteMessageIdCommandHandlerService.name,
      )
      return
    }

    const { entity, revision } = result

    entity.updateMessageId(messageId)
    await this.repo.publishEvents(entity, revision)
    this.logger.verbose(
      `Updated the message id of quote ${quoteId} to ${messageId}.`,
      UpdateQuoteMessageIdCommandHandlerService.name,
    )
  }
}
