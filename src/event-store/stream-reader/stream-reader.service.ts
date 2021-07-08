import { Injectable } from '@nestjs/common'
import {
  EventStoreDBClient,
  ReadRevision,
  ResolvedEvent,
  START,
} from '@eventstore/db-client'
import { ReadStreamOptions } from '@eventstore/db-client/dist/streams'

const DEFAULT_MAX_COUNT = 50

export type ReadStreamIterator = (resolvedEvent: ResolvedEvent) => Promise<any>

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

  async readStream(
    streamName: string,
    iterator: ReadStreamIterator,
    options: ReadStreamOptions = {},
  ): Promise<void> {
    let fromRevision: ReadRevision = options.fromRevision ?? START
    const countQuota = options.maxCount ?? DEFAULT_MAX_COUNT

    while (true) {
      const resolvedEvents = await this.client.readStream(streamName, {
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
