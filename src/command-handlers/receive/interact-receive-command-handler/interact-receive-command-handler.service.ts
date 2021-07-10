import { EventStoreDBClient } from '@eventstore/db-client'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InteractReceiveCommand } from 'src/domain/commands/interact-receive.command'

@CommandHandler(InteractReceiveCommand)
export class InteractReceiveCommandHandlerService
  implements ICommandHandler<InteractReceiveCommand>
{
  async execute({ payload }: InteractReceiveCommand): Promise<any> {
    const { karma, receiveId, userId } = payload
    throw new Error('Method not implemented.')
  }
}
