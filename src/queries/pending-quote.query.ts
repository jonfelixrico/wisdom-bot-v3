import { IQuery } from '@nestjs/cqrs'
import { IPendingQuote } from 'src/domain/entities/pending-quote.entity'

export type IPendingQuoteQueryOutput = IPendingQuote

export interface IPendingQuoteQueryInput {
  quoteId: string
}

export class PendingQuoteQuery implements IQuery {
  constructor(readonly input: IPendingQuoteQueryInput) {}
}
