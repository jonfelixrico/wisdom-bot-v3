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
import { Connection, Repository } from 'typeorm'

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
    private connection: Connection,
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

  async getPendingQuote(quoteId: string): Promise<IPendingQuote> {
    const quote = await this.quoteTr
      .createQueryBuilder()
      .where('quote.id = :quoteId AND quote.approveDt IS NULL', { quoteId })
      .getOne()

    return quote ? await convertPendingQuoteToRepoObject(quote) : null
  }

  addApprover(quoteId: string, userId: string): Promise<IPendingQuote> {
    return this.connection.transaction(async (manager) => {
      const quote = await manager.findOne(Quote, {
        id: quoteId,
      })

      const approval = await manager.create(Approval, {
        quote: Promise.resolve(quote),
        approveDt: new Date(),
        userId,
      })

      const existingApprovals = await quote.approvals

      await manager.save(approval)
      quote.approvals = Promise.resolve([...existingApprovals, approval])

      if (existingApprovals.length + 1 >= quote.requiredApprovalCount) {
        quote.approveDt = new Date()
        await manager.save(quote)
      }

      return await convertPendingQuoteToRepoObject(quote)
    })
  }
}
