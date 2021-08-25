import { Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UpdateReceiveMessageDetailsCommand } from 'src/domain/commands/update-receive-message-details.command'
import { ReceiveWriteRepository } from 'src/write-repositories/abstract/receive-write-repository.abstract'

@CommandHandler(UpdateReceiveMessageDetailsCommand)
export class UpdateReceiveMessageDetailsCommandHandlerService
  implements ICommandHandler<UpdateReceiveMessageDetailsCommand>
{
  constructor(private repo: ReceiveWriteRepository, private logger: Logger) {}

  async execute({ payload }: UpdateReceiveMessageDetailsCommand): Promise<any> {
    const { receiveId, messageId, channelId } = payload

    const result = await this.repo.findById(receiveId)
    if (!result) {
      this.logger.warn(
        `Receive ${receiveId} not found.`,
        UpdateReceiveMessageDetailsCommandHandlerService.name,
      )
      return
    }

    const { entity, revision } = result

    entity.updateMessageDetails({ messageId, channelId })
    await this.repo.publishEvents(entity, revision)
    this.logger.verbose(
      `Updated message details of receive ${receiveId}: messageId ${messageId}, channelId ${channelId}.`,
      UpdateReceiveMessageDetailsCommandHandlerService.name,
    )
  }
}
