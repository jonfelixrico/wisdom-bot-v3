import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  INewReceive,
  IReceive,
  ReceiveRepository,
} from 'src/classes/receive-repository.abstract'
import { Receive } from 'src/entities/receive.entity'
import { Repository } from 'typeorm'
import { Quote } from 'src/entities/quote.entity'

@Injectable()
export class ReceiveRepoImplService extends ReceiveRepository {
  constructor(
    @InjectRepository(Receive) private recvRepo: Repository<Receive>,
  ) {
    super()
  }

  private getReceiveCount(quoteId: string): Promise<number> {
    return this.recvRepo
      .createQueryBuilder()
      .where('quoteId = :quoteId', { quoteId })
      .getCount()
  }

  async createRecieve({
    quoteId,
    channelId,
    guildId,
    userId,
  }: INewReceive): Promise<[IReceive, number]> {
    const quote = new Quote()
    quote.id = quoteId

    const { id: receiveId, receiveDt } = await this.recvRepo.create({
      quote: Promise.resolve(quote),
      channelId,
      guildId,
      userId,
      receiveDt: new Date(),
    })

    return [
      {
        quoteId,
        channelId,
        guildId,
        userId,
        receiveId,
        receiveDt,
      },
      await this.getReceiveCount(quoteId),
    ]
  }
}
