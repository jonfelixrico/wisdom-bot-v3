import {
  ErrorType,
  EventStoreDBClient,
  ResolvedEvent,
} from '@eventstore/db-client'
import { Injectable } from '@nestjs/common'

export type ReadStreamReducerFn<T> = (state: T, event: ResolvedEvent) => T

interface IReadStreamOptions {
  batchSize?: number
  fromRevision?: number
}

const DEFAULT_BATCH_SIZE = 15

@Injectable()
export class ReadStreamService {
  constructor(private client: EventStoreDBClient) {}

  async readStream<T>(
    streamName: string,
    reducer: ReadStreamReducerFn<T>,
    options?: IReadStreamOptions,
  ): Promise<T | null> {
    const { batchSize = DEFAULT_BATCH_SIZE, fromRevision = 0 } = options ?? {}

    let currentState: T
    let revisionCtr = fromRevision

    while (true) {
      try {
        const streamEvents = await this.client.readStream(streamName, {
          maxCount: batchSize,
          fromRevision: BigInt(revisionCtr),
        })

        revisionCtr += batchSize
        currentState = streamEvents.reduce(reducer, currentState)

        if (streamEvents.length !== batchSize) {
          return currentState
        }
      } catch (error) {
        if (error.type === ErrorType.STREAM_NOT_FOUND) {
          return null
        }

        throw error
      }
    }
  }
}
