import { JSONType } from '@eventstore/db-client'

export abstract class DomainEvent<
  PayloadType extends JSONType,
  EventNameType = string,
> {
  constructor(
    readonly eventName: EventNameType,
    readonly aggregateId: string,
    readonly payload: PayloadType,
  ) {}
}
