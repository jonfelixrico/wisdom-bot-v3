export type ObjectType = { [key: string]: any }

export abstract class DomainEvent<
  PayloadType extends ObjectType = ObjectType,
  EventNameType = string,
> {
  constructor(
    readonly eventName: EventNameType,
    readonly aggregateId: string,
    readonly payload: PayloadType,
  ) {}
}
