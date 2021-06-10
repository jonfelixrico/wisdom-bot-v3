import { IEvent } from 'src/domain/event.interface'

export class PendingQuoteCancelled implements IEvent {
  constructor(private quoteId: string) {}

  readonly eventName = 'QUOTE_CANCELLED'

  get aggregateId() {
    return this.quoteId
  }

  get payload() {
    return {}
  }
}
