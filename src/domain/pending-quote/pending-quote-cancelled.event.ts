import { Event } from 'src/domain/event.abstract'

export class PendingQuoteCancelled extends Event {
  constructor(quoteId: string) {
    super('QUOTE_CANCELLED', quoteId, {})
  }
}
