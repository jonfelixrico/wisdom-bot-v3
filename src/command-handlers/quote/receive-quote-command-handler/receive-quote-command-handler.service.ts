import { Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ReceiveQuoteCommand } from 'src/domain/commands/receive-quote.command'
import { QuoteWriteRepositoryService } from 'src/write-repositories/quote-write-repository/quote-write-repository.service'

@CommandHandler(ReceiveQuoteCommand)
export class ReceiveQuoteCommandHandlerService
  implements ICommandHandler<ReceiveQuoteCommand>
{
  constructor(
    private logger: Logger,
    private repo: QuoteWriteRepositoryService,
  ) {}

  async execute({ payload }: ReceiveQuoteCommand): Promise<any> {
    const { channelId, messageId, quoteId, userId } = payload
    const quote = await this.repo.findById(quoteId)

    if (!quote) {
      this.logger.warn(`Quote ${quoteId} not found.`)
      return
    }

    const { entity, revision } = quote

    entity.receive({
      channelId,
      messageId,
      userId,
    })

    await this.repo.publishEvents(entity, revision)
  }
}
