import { NO_STREAM } from '@eventstore/db-client'
import { Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { isNil, omitBy } from 'lodash'
import { ReceiveQuoteCommand } from 'src/domain/commands/receive-quote.command'
import { QuoteWriteRepository } from 'src/write-repositories/abstract/quote-write-repository.abstract'
import { ReceiveWriteRepository } from 'src/write-repositories/abstract/receive-write-repository.abstract'

@CommandHandler(ReceiveQuoteCommand)
export class ReceiveQuoteCommandHandlerService
  implements ICommandHandler<ReceiveQuoteCommand>
{
  constructor(
    private logger: Logger,
    private quoteRepo: QuoteWriteRepository,
    private receiveRepo: ReceiveWriteRepository,
  ) {}

  async execute({ payload }: ReceiveQuoteCommand): Promise<any> {
    const { channelId, quoteId, userId, interactionToken, messageId } = payload
    const results = await this.quoteRepo.findById(quoteId)

    if (!results) {
      this.logger.warn(`Quote ${quoteId} not found.`)
      return
    }

    const { entity: quote } = results

    const receive = quote.receive({
      channelId,
      messageId,
      userId,
      ...omitBy({ interactionToken, messageId }, isNil),
    })

    await this.receiveRepo.publishEvents(receive, NO_STREAM)
  }
}
