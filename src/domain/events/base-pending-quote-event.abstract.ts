import {
  DomainEvent,
  ObjectType,
} from 'src/domain/abstracts/domain-event.abstract'

export abstract class BasePendingQuoteEvent<
  Payload = ObjectType,
> extends DomainEvent<Payload> {}
