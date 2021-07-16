import { IEvent } from '@nestjs/cqrs'

export interface IPendingQuoteReactionsReachedEvent {
  quoteId: string
}

export class PendingQuoteReactionsReachedEvent implements IEvent {
  constructor(readonly payload: IPendingQuoteReactionsReachedEvent) {}
}
