import { NO_STREAM } from '@eventstore/db-client'
import { Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { SubmitQuoteCommand } from 'src/domain/commands/submit-quote.command'
import { PendingQuote } from 'src/domain/entities/pending-quote.entity'
import { PendingQuoteWriteRepositoryService } from 'src/write-repositories/pending-quote-write-repository/pending-quote-write-repository.service'
import { v4 } from 'uuid'

@CommandHandler(SubmitQuoteCommand)
export class SubmitQuoteCommandHandlerService
  implements ICommandHandler<SubmitQuoteCommand>
{
  constructor(
    private logger: Logger,
    private repo: PendingQuoteWriteRepositoryService,
  ) {}

  async execute({ payload }: SubmitQuoteCommand): Promise<any> {
    const quoteId = v4()

    const submitted = PendingQuote.submit(payload)

    await this.repo.publishEvents(submitted, NO_STREAM)

    this.logger.debug(
      `Created quote ${quoteId}.`,
      SubmitQuoteCommandHandlerService.name,
    )
  }
}
