import { IEvent } from 'src/domain/event.interface'

export class PendingQuoteAccepted implements IEvent {
  constructor(private quoteId: string) {}

  readonly eventName = 'QUOTE_ACCEPTED'

  get aggregateId() {
    return this.quoteId
  }

  get payload() {
    return {}
  }
}
