import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import {
  IPendingQuoteVoteQueryOuput,
  PendingQuoteVoteQuery,
} from 'src/queries/pending-quote-vote.query'
import { QuoteVoteTypeormEntity } from 'src/typeorm/entities/quote-vote.typeorm-entity'
import { Connection } from 'typeorm'

@QueryHandler(PendingQuoteVoteQuery)
export class PendingQuoteVoteQueryHandlerService
  implements IQueryHandler<PendingQuoteVoteQuery>
{
  constructor(private conn: Connection) {}

  async execute({
    input,
  }: PendingQuoteVoteQuery): Promise<IPendingQuoteVoteQueryOuput> {
    const { quoteId, userId } = input

    const vote = await this.conn.getRepository(QuoteVoteTypeormEntity).findOne({
      userId,
      quoteId,
    })

    if (!vote) {
      return null
    }

    const { value } = vote

    return {
      value,
      quoteId,
      userId,
    }
  }
}
