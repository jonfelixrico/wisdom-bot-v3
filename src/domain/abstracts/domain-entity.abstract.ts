export abstract class DomainEntity<EventType> {
  private _events: EventType[]

  apply(event: EventType) {
    this._events.push(event)
  }

  get events() {
    return [...this._events]
  }
}
