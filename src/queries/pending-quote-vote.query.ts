import { IQuery } from '@nestjs/cqrs'

export interface IPendingQuoteVoteQueryInput {
  userId: string
  quoteId: string
}

export interface IPendingQuoteVoteQueryOuput {
  value: number
  userId: string
  quoteId: string
}

export class PendingQuoteVoteQuery implements IQuery {
  constructor(readonly input: IPendingQuoteVoteQueryInput) {}
}
