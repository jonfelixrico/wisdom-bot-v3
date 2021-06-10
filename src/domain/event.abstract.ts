interface IEvent<PayloadType> {
  readonly eventName: string
  readonly aggregateId: string
  readonly payload: PayloadType
}

export abstract class Event<PayloadType = Record<string, unknown>>
  implements IEvent<PayloadType>
{
  constructor(
    readonly eventName: string,
    readonly aggregateId: string,
    readonly payload,
  ) {}
}
