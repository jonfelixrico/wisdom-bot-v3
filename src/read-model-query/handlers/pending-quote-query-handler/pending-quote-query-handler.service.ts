import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import {
  IPendingQuoteQueryOutput,
  PendingQuoteQuery,
} from 'src/queries/pending-quote.query'
import { QuoteVoteTypeormEntity } from 'src/typeorm/entities/quote-vote.typeorm-entity'
import { QuoteTypeormEntity } from 'src/typeorm/entities/quote.typeorm-entity'
import { Connection } from 'typeorm'

@QueryHandler(PendingQuoteQuery)
export class PendingQuoteQueryHandlerService
  implements IQueryHandler<PendingQuoteQuery>
{
  constructor(private conn: Connection) {}

  private get quoteRepo() {
    return this.conn.getRepository(QuoteTypeormEntity)
  }

  private get voteRepo() {
    return this.conn.getRepository(QuoteVoteTypeormEntity)
  }

  async execute({
    input,
  }: PendingQuoteQuery): Promise<IPendingQuoteQueryOutput> {
    const { quoteId } = input

    const quote = await this.quoteRepo.findOne({ id: quoteId })

    if (!quote) {
      return null
    }

    const votes = await this.voteRepo.find({ quoteId })

    return {
      ...quote,
      quoteId,
      votes: votes.map(({ value: voteValue, userId }) => ({
        voteValue,
        userId,
      })),
    }
  }
}
