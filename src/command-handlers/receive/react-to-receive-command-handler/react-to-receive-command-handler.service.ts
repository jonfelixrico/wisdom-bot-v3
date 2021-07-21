import { Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ReactToReceiveCommand } from 'src/domain/commands/react-to-receive.command'
import { ReceiveWriteRepositoryService } from 'src/write-repositories/receive-write-repository/receive-write-repository.service'

@CommandHandler(ReactToReceiveCommand)
export class ReactToReceiveCommandHandlerService
  implements ICommandHandler<ReactToReceiveCommand>
{
  constructor(
    private repo: ReceiveWriteRepositoryService,
    private logger: Logger,
  ) {}

  async execute({ payload }: ReactToReceiveCommand): Promise<any> {
    const { karma, receiveId, userId } = payload

    const receive = await this.repo.findById(receiveId)
    if (!receive) {
      this.logger.verbose(
        `Did not process InteractReceiveCommand for receive ${receiveId} not found.`,
        ReactToReceiveCommandHandlerService.name,
      )
      return null
    }

    const { entity, revision } = receive
    entity.react({ karma, userId })

    this.repo.publishEvents(entity, revision)
    this.logger.verbose(
      `Processed InteractReceiveCommand for receive ${receiveId}.`,
      ReactToReceiveCommandHandlerService.name,
    )

    return entity
  }
}
