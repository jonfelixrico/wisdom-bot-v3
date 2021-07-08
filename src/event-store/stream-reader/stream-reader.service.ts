import { Injectable } from '@nestjs/common'
import {
  EventStoreDBClient,
  EventType,
  JSONEventType,
  ReadRevision,
  ResolvedEvent,
  START,
} from '@eventstore/db-client'
import { ReadStreamOptions } from '@eventstore/db-client/dist/streams'

const DEFAULT_MAX_COUNT = 50

/*
 * Our interfaces seem to conflict with ESDB's Record<string | number, unknown> constraint
 * on JSONEventType, so we made these two to compensate.
 */

export type ExtendedJSONEventType<
  T extends { [key: string]: any } = { [key: string]: any },
> = JSONEventType<string, T, unknown>

export type ExtendedEventType = EventType | ExtendedJSONEventType

export type ReadStreamIterator<
  T extends ExtendedEventType = ExtendedEventType,
> = (resolvedEvent: ResolvedEvent<T>) => Promise<any>

/**
 * This is pretty much a paginated version of `EventStoreDBClient#readStream`.
 * It's easier to explain why we would need this instead of explaining what it is:
 *
 * For example, you want to read the stream which contains tens of thousands of events, or anything with
 * an absurd amount. If you load all of that, there's a risk where you'll run out of memory since they're
 * too many.
 *
 * A smarter approach to do to avoid the memory problem is to gradually just load the events until
 * you've reached the end of the stream. This service serves as the framework to make the smarter approach more
 * convenient to utilize again and again.
 */
@Injectable()
export class StreamReaderService {
  constructor(private client: EventStoreDBClient) {}

  async readStream<E extends ExtendedEventType = ExtendedEventType>(
    streamName: string,
    iterator: ReadStreamIterator<E>,
    options: ReadStreamOptions = {},
  ): Promise<void> {
    let fromRevision: ReadRevision = options.fromRevision ?? START
    const countQuota = options.maxCount ?? DEFAULT_MAX_COUNT

    while (true) {
      const resolvedEvents = await this.client.readStream<E>(streamName, {
        ...options,
        fromRevision,
      })

      if (!resolvedEvents.length) {
        return
      }

      for (const resolvedEvent of resolvedEvents) {
        await iterator(resolvedEvent)
      }

      if (resolvedEvents.length < countQuota) {
        return
      }

      fromRevision =
        resolvedEvents[resolvedEvents.length - 1].event.revision + 1n
    }
  }
}
