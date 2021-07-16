import { Logger } from '@nestjs/common'
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs'
import { GuildRepoService } from 'src/discord/guild-repo/guild-repo.service'
import { PendingQuoteWriteRepositoryService } from 'src/write-repositories/pending-quote-write-repository/pending-quote-write-repository.service'
import { RegeneratePendingQuoteMessageCommand } from '../commands/regenerate-pending-quote-message.command'

@CommandHandler(RegeneratePendingQuoteMessageCommand)
export class RegeneratePendingQuoteMessageCommandHandlerService
  implements ICommandHandler<RegeneratePendingQuoteMessageCommand>
{
  constructor(
    private writeRepo: PendingQuoteWriteRepositoryService,
    private logger: Logger,
    private guildRepo: GuildRepoService,
    private eventBus: EventBus,
  ) {}

  async execute({
    payload,
  }: RegeneratePendingQuoteMessageCommand): Promise<any> {
    const { quoteId, channelId, guildId } = payload

    const channel = await this.guildRepo.getTextChannel(guildId, channelId)
    if (!channel) {
      this.logger.warn(
        `Channel ${channelId} not found.`,
        RegeneratePendingQuoteMessageCommandHandlerService.name,
      )
    }

    const result = await this.writeRepo.findById(quoteId)
    if (!result) {
      this.logger.warn(
        `Quote not found ${quoteId}`,
        RegeneratePendingQuoteMessageCommandHandlerService.name,
      )
      return null
    }

    const newMessage = await channel.send('regeneration message')

    const { entity, revision } = result

    entity.updateMessageId(newMessage.id)
    await this.writeRepo.publishEvents(entity, revision)

    // TODO watch message here
  }
}
