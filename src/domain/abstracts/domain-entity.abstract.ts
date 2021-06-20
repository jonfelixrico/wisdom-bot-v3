import { DomainEvent } from './domain-event.abstract'

export abstract class DomainEntity<
  EventType extends DomainEvent = DomainEvent,
> {
  private _events: EventType[] = []

  apply(event: EventType) {
    this._events.push(event)
  }

  get events() {
    return [...this._events]
  }
}
