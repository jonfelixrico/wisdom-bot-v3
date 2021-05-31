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

async function convertReceiveEntToObject({
  quote: pQuote,
  channelId,
  guildId,
  userId,
  receiveDt,
  id: receiveId,
}: Receive): Promise<IReceive> {
  const quote = await pQuote

  return {
    channelId,
    guildId,
    userId,
    receiveDt,
    quoteId: quote.id,
    receiveId,
  }
}

@Injectable()
export class ReceiveRepoImplService extends ReceiveRepository {
  constructor(
    @InjectRepository(Receive) private recvRepo: Repository<Receive>,
    @InjectRepository(Quote) private quoteRepo: Repository<Quote>,
  ) {
    super()
  }

  async createRecieve({
    quoteId,
    channelId,
    guildId,
    userId,
  }: INewReceive): Promise<[IReceive, number]> {
    const quote = await this.quoteRepo.findOne({ id: quoteId })
    const receives = await quote.receives

    const newReceive = await this.recvRepo.create({
      quote: Promise.resolve(quote),
      channelId,
      guildId,
      userId,
    })

    return [await convertReceiveEntToObject(newReceive), receives.length + 1]
  }
}
