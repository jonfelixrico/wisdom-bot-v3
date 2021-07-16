import { IEvent } from '@nestjs/cqrs'
import { Message } from 'discord.js'

export interface IPendingQuoteReactionsReachedEvent {
  quoteId: string
  message: Message
}

export class PendingQuoteReactionsReachedEvent implements IEvent {
  constructor(readonly payload: IPendingQuoteReactionsReachedEvent) {}
}
