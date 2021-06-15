import { Injectable } from '@nestjs/common'
import { Quote, IQuoteReceive } from 'src/domain/quote/quote.entity'
import { QuoteRepository } from 'src/domain/quote/quote.repository'
import { Repository } from 'typeorm'
import { QuoteDbEntity } from 'src/typeorm/entities/quote.typeorm-entity'
import { Inject } from '@nestjs/common'

@Injectable()
export class QuoteRepositoryService extends QuoteRepository {
  constructor(
    @Inject('QUOTE_ENTITY') private quoteTr: Repository<QuoteDbEntity>,
  ) {
    super()
  }

  async findById(id: string): Promise<Quote> {
    const quoteEnt = await this.quoteTr.findOne(
      { id },
      { relations: ['receives'] },
    )

    if (!quoteEnt) {
      return null
    }

    const receiveEnts = await quoteEnt.receives

    const receives = receiveEnts.map<IQuoteReceive>(
      ({ id: receiveId, receiveDt, userId }) => ({
        receiveId,
        receiveDt,
        userId,
      }),
    )

    const {
      approveDt: acceptDt,
      authorId,
      content,
      guildId,
      id: quoteId,
      submitDt,
      submitterId,
    } = quoteEnt

    return new Quote({
      acceptDt,
      authorId,
      content,
      guildId,
      quoteId,
      submitDt,
      submitterId,
      receives,
    })
  }
}
