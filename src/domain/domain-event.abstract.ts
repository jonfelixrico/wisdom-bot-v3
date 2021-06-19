import { DomainEventNames } from './domain-event-names.enum'

interface IEvent<PayloadType> {
  readonly eventName: DomainEventNames
  readonly aggregateId: string
  readonly payload: PayloadType
}

export abstract class DomainEvent<
  PayloadType extends { [key: string]: any } = { [key: string]: any },
> implements IEvent<PayloadType>
{
  constructor(
    readonly eventName: DomainEventNames,
    readonly aggregateId: string,
    readonly payload: PayloadType,
  ) {}
}
