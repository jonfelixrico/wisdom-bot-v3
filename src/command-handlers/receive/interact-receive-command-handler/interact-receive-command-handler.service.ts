import { Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ReactionToReceiveCommand } from 'src/domain/commands/react-to-receive.command'
import { ReceiveWriteRepositoryService } from 'src/write-repositories/receive-write-repository/receive-write-repository.service'

@CommandHandler(ReactionToReceiveCommand)
export class InteractReceiveCommandHandlerService
  implements ICommandHandler<ReactionToReceiveCommand>
{
  constructor(
    private repo: ReceiveWriteRepositoryService,
    private logger: Logger,
  ) {}

  async execute({ payload }: ReactionToReceiveCommand): Promise<any> {
    const { karma, receiveId, userId } = payload

    const receive = await this.repo.findById(receiveId)
    if (!receive) {
      this.logger.verbose(
        `Did not process InteractReceiveCommand for receive ${receiveId} not found.`,
        InteractReceiveCommandHandlerService.name,
      )
      return null
    }

    const { entity, revision } = receive
    entity.react({ karma, userId })

    this.repo.publishEvents(entity, revision)
    this.logger.verbose(
      `Processed InteractReceiveCommand for receive ${receiveId}.`,
      InteractReceiveCommandHandlerService.name,
    )

    return entity
  }
}
