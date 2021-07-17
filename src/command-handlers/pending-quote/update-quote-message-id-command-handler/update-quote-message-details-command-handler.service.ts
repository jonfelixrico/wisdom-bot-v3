import { Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UpdateQuoteMessageDetailsCommand } from 'src/domain/commands/update-quote-message-id.command'
import { PendingQuoteWriteRepositoryService } from 'src/write-repositories/pending-quote-write-repository/pending-quote-write-repository.service'

@CommandHandler(UpdateQuoteMessageDetailsCommand)
export class UpdateQuoteMessageDetailsCommandHandlerService
  implements ICommandHandler<UpdateQuoteMessageDetailsCommand>
{
  constructor(
    private repo: PendingQuoteWriteRepositoryService,
    private logger: Logger,
  ) {}

  async execute({ payload }: UpdateQuoteMessageDetailsCommand): Promise<any> {
    const { quoteId, messageId, channelId } = payload

    const result = await this.repo.findById(quoteId)
    if (!result) {
      this.logger.warn(
        `Quote ${quoteId} not found.`,
        UpdateQuoteMessageDetailsCommandHandlerService.name,
      )
      return
    }

    const { entity, revision } = result

    entity.updateMessageDetails({ messageId, channelId })
    await this.repo.publishEvents(entity, revision)
    this.logger.verbose(
      `Updated message details of quote ${quoteId}: messageId ${messageId}, channelId ${channelId}.`,
      UpdateQuoteMessageDetailsCommandHandlerService.name,
    )
  }
}
