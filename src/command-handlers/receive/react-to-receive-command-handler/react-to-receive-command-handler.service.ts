import { Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ReactToReceiveCommand } from 'src/domain/commands/react-to-receive.command'
import { ReceiveWriteRepository } from 'src/write-repositories/abstract/receive-write-repository.abstract'

@CommandHandler(ReactToReceiveCommand)
export class ReactToReceiveCommandHandlerService
  implements ICommandHandler<ReactToReceiveCommand>
{
  constructor(private repo: ReceiveWriteRepository, private logger: Logger) {}

  async execute({ payload }: ReactToReceiveCommand): Promise<any> {
    const { karma, receiveId, userId } = payload

    const receive = await this.repo.findById(receiveId)
    if (!receive) {
      this.logger.verbose(
        `Did not process ReactToReceiveCommand for receive ${receiveId} not found.`,
        ReactToReceiveCommandHandlerService.name,
      )
      return null
    }

    const { entity, revision } = receive
    entity.react({ karma, userId })

    this.repo.publishEvents(entity, revision)
    this.logger.verbose(
      `Processed ReactToReceiveCommand for receive ${receiveId}.`,
      ReactToReceiveCommandHandlerService.name,
    )

    return entity
  }
}
