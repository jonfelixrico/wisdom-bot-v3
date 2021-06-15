import { Logger } from '@nestjs/common'
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs'
import { QuoteSubmitted } from 'src/domain/pending-quote/quote-submitted.event'
import { SubmitQuoteCommand } from 'src/domain/pending-quote/submit-quote.command'
import { v4 } from 'uuid'

@CommandHandler(SubmitQuoteCommand)
export class SubmitQuoteCommandHandlerService
  implements ICommandHandler<SubmitQuoteCommand>
{
  constructor(private bus: EventBus, private logger: Logger) {}

  async execute({ payload }: SubmitQuoteCommand): Promise<any> {
    const quoteId = v4()
    const event = new QuoteSubmitted({
      ...payload,
      quoteId,
      acceptDt: null,
      cancelDt: null,
    })

    this.bus.publish(event)

    this.logger.debug(
      `Created quote ${quoteId}.`,
      SubmitQuoteCommandHandlerService.name,
    )
  }
}
