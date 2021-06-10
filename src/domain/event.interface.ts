export interface IEvent<Payload = Record<string, unknown>> {
  readonly eventName: string
  readonly aggregateId: string
  readonly payload: Payload
}
