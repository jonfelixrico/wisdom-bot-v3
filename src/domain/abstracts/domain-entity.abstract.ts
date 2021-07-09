import { DomainEvent } from './domain-event.abstract'

export abstract class DomainEntity {
  private _events: DomainEvent[] = []

  apply(...events: DomainEvent[]) {
    this._events.push(...events)
  }

  get events() {
    return [...this._events]
  }
}
