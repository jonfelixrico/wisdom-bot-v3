import { IEvent } from '@nestjs/cqrs'

export interface IPendingQuoteAcceptedEventPayload {
  quoteId: string
}

export class PendingQuoteAcceptedEvent implements IEvent {
  constructor(readonly payload: IPendingQuoteAcceptedEventPayload) {}
}
