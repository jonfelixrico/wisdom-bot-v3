import { Inject, Injectable } from '@nestjs/common'
import { ReceiveDbEntity } from 'src/typeorm/entities/receive.typeorm-entity'
import { Repository } from 'typeorm'
import { IInteraction, Receive } from 'src/domain/entities/receive.entity'

@Injectable()
export class ReceiveRepositoryService {
  constructor(
    @Inject('RECEIVE_ENTITY') private repo: Repository<ReceiveDbEntity>,
  ) {}

  async findById(receiveId: string): Promise<Receive> {
    const receiveEnt = await this.repo.findOne(
      { id: receiveId },
      { relations: ['concurs'] },
    )

    if (!receiveEnt) {
      return null
    }

    const concurEnts = await receiveEnt.concurs

    const interactions = concurEnts.map<IInteraction>(
      ({ concurDt: interactDt, id: interactionId, userId, karma }) => ({
        interactDt,
        interactionId,
        karma,
        userId,
      }),
    )

    const { channelId, messageId, quoteId } = receiveEnt

    return new Receive({
      channelId,
      interactions,
      messageId,
      quoteId,
      receiveId,
    })
  }
}
