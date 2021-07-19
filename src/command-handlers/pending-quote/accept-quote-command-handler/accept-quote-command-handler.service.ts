import { Logger } from '@nestjs/common'
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AcceptPendingQuoteCommand } from 'src/domain/commands/accept-pending-quote.command'
import { SendQuoteAcceptedMessageCommand } from 'src/infrastructure/commands/send-quote-accepted-notification.command'
import { PendingQuoteWriteRepositoryService } from 'src/write-repositories/pending-quote-write-repository/pending-quote-write-repository.service'

@CommandHandler(AcceptPendingQuoteCommand)
export class AcceptQuoteCommandHandlerService
  implements ICommandHandler<AcceptPendingQuoteCommand>
{
  constructor(
    private logger: Logger,
    private repo: PendingQuoteWriteRepositoryService,
    private commandBus: CommandBus,
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

    const {
      authorId,
      messageId,
      submitterId,
      content,
      channelId,
      guildId,
      submitDt,
    } = entity

    this.commandBus.execute(
      new SendQuoteAcceptedMessageCommand({
        messageId,
        channelId,
        guildId,
        quote: {
          authorId,
          submitterId,
          content,
          year: submitDt.getFullYear(),
        },
      }),
    )
  }
}
