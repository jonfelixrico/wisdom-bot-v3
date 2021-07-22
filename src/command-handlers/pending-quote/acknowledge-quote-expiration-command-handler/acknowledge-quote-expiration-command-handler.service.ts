import { Logger } from '@nestjs/common'
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AcknowledgePendingQuoteExpirationCommand } from 'src/domain/commands/acknowledge-pending-quote-expiration.command'
import { UpdateSubmitMessageAsExpiredCommand } from 'src/infrastructure/commands/update-submit-message-to-expired.command'
import { PendingQuoteWriteRepository } from 'src/write-repositories/abstract/pending-quote-write-repository.abstract'

@CommandHandler(AcknowledgePendingQuoteExpirationCommand)
export class AcknowledgeQuoteExpirationCommandHandlerService
  implements ICommandHandler<AcknowledgePendingQuoteExpirationCommand>
{
  constructor(
    private repo: PendingQuoteWriteRepository,
    private logger: Logger,
    private commandBus: CommandBus,
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

    const {
      authorId,
      content,
      expireDt,
      guildId,
      upvoteEmoji,
      upvoteCount,
      channelId,
      submitterId,
      submitDt,
      messageId,
    } = entity

    await this.commandBus.execute(
      new UpdateSubmitMessageAsExpiredCommand({
        authorId,
        content,
        expireDt,
        guildId,
        upvoteCount,
        upvoteEmoji,
        channelId,
        messageId,
        submitDt,
        submitterId,
      }),
    )
  }
}
