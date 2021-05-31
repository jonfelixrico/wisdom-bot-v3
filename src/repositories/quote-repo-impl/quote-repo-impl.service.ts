import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  INewQuote,
  IPendingQuote,
  IQuote,
  QuoteRepository,
} from 'src/classes/quote-repository.abstract'
import { Approval } from 'src/entities/approval.entity'
import { Quote } from 'src/entities/quote.entity'
import { Repository } from 'typeorm'

function convertQuoteToRepoObject(quote: Quote): IQuote {
  const {
    id: quoteId,
    content,
    messageId,
    authorId,
    submitterId,
    guildId,
    channelId,
    submitDt,
  } = quote

  return {
    quoteId,
    content,
    messageId,
    authorId,
    submitterId,
    guildId,
    channelId,
    submitDt,
  }
}

async function convertPendingQuoteToRepoObject(
  quote: Quote,
): Promise<IPendingQuote> {
  const base = convertQuoteToRepoObject(quote)
  const { expireDt, approveDt, requiredApprovalCount } = quote

  const approvals = (await quote.approvals) || []

  return {
    expireDt,
    approveDt,
    requiredApprovalCount,
    approvers: approvals.map(({ userId, approveDt }) => ({
      userId,
      approveDt,
    })),
    ...base,
  }
}

@Injectable()
export class QuoteRepoImplService extends QuoteRepository {
  constructor(
    @InjectRepository(Quote)
    private quoteTr: Repository<Quote>,
    @InjectRepository(Approval)
    private approvalTr: Repository<Approval>,
  ) {
    super()
  }

  async getQuote(quoteId: string): Promise<IQuote> {
    const quote = await this.quoteTr
      .createQueryBuilder()
      .where('quote.id = :quoteId AND quote.approveDt IS NOT NULL', { quoteId })
      .getOne()

    return quote ? convertQuoteToRepoObject(quote) : null
  }

  getRandomQuote(guildId: string): Promise<IQuote> {
    throw new Error('Method not implemented.')
  }

  async createQuote(newQuote: INewQuote): Promise<IPendingQuote> {
    const quote = this.quoteTr.create(newQuote)
    await this.quoteTr.save(quote)
    return await convertPendingQuoteToRepoObject(quote)
  }

  getPendingQuotes(guildId: string): Promise<IPendingQuote[]> {
    throw new Error('Method not implemented.')
  }

  getPendingQuote(quoteId: string): Promise<IPendingQuote> {
    throw new Error('Method not implemented.')
  }

  async addApprover(quoteId: string, userId: string): Promise<IPendingQuote> {
    let quote = await this.quoteTr.findOne({
      id: quoteId,
    })

    const approval = await this.approvalTr.create({
      quote: Promise.resolve(quote),
      approveDt: new Date(),
      userId,
    })

    await this.approvalTr.save(approval)

    quote = await this.quoteTr.findOne({
      id: quoteId,
    })

    return await convertPendingQuoteToRepoObject(quote)
  }
}
