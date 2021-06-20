import { Injectable } from '@nestjs/common'
import {
  EventStoreDBClient,
  ExpectedRevision,
  jsonEvent,
} from '@eventstore/db-client'
import { DomainEvent } from 'src/domain/abstracts/domain-event.abstract'

export interface IEventPublishOptions {
  /**
   * This is for optimistic locking; this is what you'd usually provide to `EventStoreDBClient#appendToStream`
   * to check for concurrency problems.
   */
  expectedRevision?: ExpectedRevision
  /*
   * Provide a function here if the stream name is not directly the `aggregateId` of the domain object,
   * e.g. a quote's stream name needs "quote-" prefixed before the actual aggregate id value.
   */
  aggregateIdFormatterFn?: (aggregateId: string) => string
}

/**
 * This is what we'd use if `aggregateIdFormatterFn` was not provided for the `publishEvents` call.
 * This simply uses the aggregate id of the events directly.
 */
const defaultAggregateFormatterFn = (id: string) => id

/**
 * Checks if each `DomainEvent#aggerateId` is the same as the rest.
 * @param param0 Array of `DomainEvent` objects.
 * @returns `true` if all instances have the same `aggregateId`, `false` if otherwise.
 */
const checkIfEventsHaveSameAggregateId = <T extends DomainEvent = DomainEvent>([
  first,
  ...others
]: T[]) => others.every((event) => event.aggregateId === first.aggregateId)

@Injectable()
/**
 * This is a helper service for publishing domain events.
 */
export class DomainEventPublisherService {
  constructor(private client: EventStoreDBClient) {}

  /**
   * Publishes an array of domain events.
   * @param events These events must have the same aggregate id. If at least one is different,
   *   then an error will be thrown.
   * @param options
   */
  async publishEvents<T extends DomainEvent = DomainEvent>(
    events: T[],
    options?: IEventPublishOptions,
  ): Promise<void> {
    const {
      expectedRevision,
      aggregateIdFormatterFn = defaultAggregateFormatterFn,
    } = options || {}

    if (!checkIfEventsHaveSameAggregateId(events)) {
      throw new Error('Events must have the same aggregate id.')
    }

    const streamName = aggregateIdFormatterFn(events[0].aggregateId)
    const eventDataArr = events.map(({ payload, eventName }) =>
      jsonEvent({
        type: eventName,
        data: payload,
      }),
    )

    await this.client.appendToStream(streamName, eventDataArr, {
      expectedRevision,
    })
  }
}
