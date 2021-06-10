import { Event } from 'src/domain/event.abstract'

export class PendingQuoteAccepted extends Event {
  constructor(quoteId: string) {
    super('QUOTE_ACCEPTED', quoteId, {})
  }
}
