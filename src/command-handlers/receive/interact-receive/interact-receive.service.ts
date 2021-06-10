import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { InteractReceive } from 'src/domain/receive/interact-receive.command'
import { ReceiveRepository } from 'src/domain/receive/receive.repository'

@CommandHandler(InteractReceive)
export class InteractReceiveService
  implements ICommandHandler<InteractReceive>
{
  constructor(private pub: EventPublisher, private repo: ReceiveRepository) {}

  async execute({ payload }: InteractReceive): Promise<any> {
    const fromRepo = await this.repo.findById(payload.receiveId)

    if (!fromRepo) {
      // TODO throw custom error
      throw new Error('Receive not found.')
    }

    const receive = this.pub.mergeObjectContext(fromRepo)
    receive.interact(payload)
    receive.commit()
  }
}
