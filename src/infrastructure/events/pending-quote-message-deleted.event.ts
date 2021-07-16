import { IEvent } from '@nestjs/cqrs'
import { Message } from 'discord.js'

export interface IPendingQuoteMessageDeletedEventPayload {
  quoteId: string
  message: Message
}

export class PendingQuoteMessageDeletedEvent implements IEvent {
  constructor(readonly payload: IPendingQuoteMessageDeletedEventPayload) {}
}
