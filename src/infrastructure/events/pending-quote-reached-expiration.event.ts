import { IEvent } from '@nestjs/cqrs'
import { Message } from 'discord.js'

export interface IPendingQuoteReachedExpirationEventPayload {
  quoteId: string
  message: Message
}

export class PendingQuoteReachedExpirationEvent implements IEvent {
  constructor(readonly payload: IPendingQuoteReachedExpirationEventPayload) {}
}
