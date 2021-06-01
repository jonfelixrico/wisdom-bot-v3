import { Inject, Injectable } from '@nestjs/common'
import {
  INewReceive,
  IReceive,
  ReceiveRepository,
} from 'src/classes/receive-repository.abstract'
import { Receive } from 'src/typeorm/entities/receive.entity'
import { Repository } from 'typeorm'
import { Quote } from 'src/typeorm/entities/quote.entity'

async function convertReceiveEntToObject({
  channelId,
  guildId,
  userId,
  id: receiveId,
  receiveDt,
  messageId,
  quote: pQuote,
}: Receive): Promise<IReceive> {
  const quote = await pQuote
  return {
    quoteId: quote.id,
    channelId,
    guildId,
    userId,
    receiveId,
    receiveDt,
    messageId,
  }
}

@Injectable()
export class ReceiveRepoImplService extends ReceiveRepository {
  constructor(@Inject('RECEIVE_ENTITY') private recvRepo: Repository<Receive>) {
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
    messageId,
    receiveDt,
  }: INewReceive): Promise<[IReceive, number]> {
    const quote = new Quote()
    quote.id = quoteId

    const receive = await this.recvRepo.save({
      quote: Promise.resolve(quote),
      channelId,
      guildId,
      userId,
      receiveDt: receiveDt || new Date(),
      messageId,
    })

    return [
      await convertReceiveEntToObject(receive),
      await this.getReceiveCount(quoteId),
    ]
  }

  async findReceiveByMessageId(messageId: string): Promise<IReceive> {
    const receive = await this.recvRepo.findOne({ messageId })
    return receive ? await convertReceiveEntToObject(receive) : null
  }
}
