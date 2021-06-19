import { Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { QuoteSubmittedEvent } from 'src/domain/pending-quote/events/quote-submitted.event'
import { SubmitQuoteCommand } from 'src/domain/pending-quote/submit-quote.command'
import { PendingQuoteEsdbRepository } from 'src/write-repositories/abstract/pending-quote-esdb-repository.abstract'
import { v4 } from 'uuid'

@CommandHandler(SubmitQuoteCommand)
export class SubmitQuoteCommandHandlerService
  implements ICommandHandler<SubmitQuoteCommand>
{
  constructor(
    private logger: Logger,
    private repo: PendingQuoteEsdbRepository,
  ) {}

  async execute({ payload }: SubmitQuoteCommand): Promise<any> {
    const quoteId = v4()

    const event = new QuoteSubmittedEvent({
      ...payload,
      quoteId,
      acceptDt: null,
      cancelDt: null,
    })

    await this.repo.publishEvent(event)

    this.logger.debug(
      `Created quote ${quoteId}.`,
      SubmitQuoteCommandHandlerService.name,
    )
  }
}
