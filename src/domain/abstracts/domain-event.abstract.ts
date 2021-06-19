interface IEvent<PayloadType, EventNameType> {
  readonly eventName: EventNameType
  readonly aggregateId: string
  readonly payload: PayloadType
}

export type ObjectType = { [key: string]: any }

export abstract class DomainEvent<
  PayloadType extends ObjectType = ObjectType,
  EventNameType = string,
> implements IEvent<PayloadType, EventNameType>
{
  constructor(
    readonly eventName: EventNameType,
    readonly aggregateId: string,
    readonly payload: PayloadType,
  ) {}
}
