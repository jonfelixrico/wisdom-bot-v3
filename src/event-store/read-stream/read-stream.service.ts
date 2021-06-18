import {
  ErrorType,
  EventStoreDBClient,
  ResolvedEvent,
} from '@eventstore/db-client'
import { Logger } from '@nestjs/common'
import { Injectable } from '@nestjs/common'

export type PrematureReturnFn<T> = (prematureValue?: T) => void

export type ReadStreamReducerFn<T> = (
  state: T,
  event: ResolvedEvent,
  prematureReturn?: PrematureReturnFn<T>,
) => T

interface IReadStreamOptions {
  batchSize?: number
  fromRevision?: number
}

interface IPrematureReturn<T> {
  value: T
}

const DEFAULT_BATCH_SIZE = 15

@Injectable()
export class ReadStreamService {
  constructor(private client: EventStoreDBClient, private logger: Logger) {}

  async readStream<T>(
    streamName: string,
    reducer: ReadStreamReducerFn<T>,
    options?: IReadStreamOptions,
  ): Promise<T | null> {
    const { logger } = this
    const { batchSize = DEFAULT_BATCH_SIZE, fromRevision = 0 } = options ?? {}

    let currentState: T
    let revisionCtr = fromRevision

    let prematureReturn: IPrematureReturn<T>

    function prematureReturnTrigger(value: T): void {
      logger.debug(
        `Cancelled reading stream ${streamName}.`,
        ReadStreamService.name,
      )
      prematureReturn = { value }
    }

    while (true) {
      try {
        const streamEvents = await this.client.readStream(streamName, {
          maxCount: batchSize,
          fromRevision: BigInt(revisionCtr),
        })

        revisionCtr += batchSize
        currentState = streamEvents.reduce((acc, val) => {
          return reducer(acc, val, prematureReturnTrigger)
        }, currentState)

        if (prematureReturn) {
          return prematureReturn.value
        } else if (streamEvents.length !== batchSize) {
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
