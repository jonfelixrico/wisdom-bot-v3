import { DomainEvent } from './domain-event.abstract'

export abstract class DomainEntity<
  EventType extends DomainEvent = DomainEvent,
> {
  private _events: EventType[] = []

  apply(...events: EventType[]) {
    this._events.push(...events)
  }

  get events() {
    return [...this._events]
  }
}
