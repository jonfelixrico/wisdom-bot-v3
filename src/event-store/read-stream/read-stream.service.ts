import {
  ErrorType,
  EventStoreDBClient,
  ExpectedRevision,
  jsonEvent,
  ResolvedEvent,
} from '@eventstore/db-client'
import { Injectable } from '@nestjs/common'
import { DomainEvent } from 'src/domain/domain-event.abstract'
import { v4 } from 'uuid'

export type ReducerNext<T> = (newState: T) => void
export type ReducerStop<T> = (breakState?: T) => void
export type ReducerSkip = () => void
export type Reducer<T> = (
  state: T,
  event: ResolvedEvent,
  next: ReducerNext<T>,
  otherOperations?: {
    skip?: ReducerSkip
    stop?: ReducerStop<T>
  },
) => void

export interface IDerivedState<T> {
  state: T
  revision: bigint
}

interface IReducerOutput<T> {
  state: IDerivedState<T>
  stop?: boolean
}

const BATCH_SIZE = BigInt(100)

function reduce<T>(
  { state: currentState }: IDerivedState<T>,
  resolvedEvent: ResolvedEvent,
  reducer: Reducer<T>,
): Promise<IReducerOutput<T>> {
  const { revision } = resolvedEvent.event

  return new Promise(async (rawResolve, reject) => {
    let hasResolved = false
    /**
     * This SHOULD be called instead of the native resolve (`rawResolve`).
     * This makes sure that we're only calling resolve once, and also acts
     * as a helper and automatically provides the version of the event.
     * @param resultingStateFromReducer
     * @returns
     */
    const resolve = (resultingStateFromReducer: T, stop?: boolean) => {
      if (hasResolved) {
        // TODO emit a warning here
        return
      }

      hasResolved = true
      rawResolve({
        state: {
          revision,
          state: resultingStateFromReducer,
        },
        stop,
      })
    }

    try {
      reducer(
        currentState,
        resolvedEvent,
        (updatedState) => resolve(updatedState),
        {
          stop: (endState) => resolve(endState),
          skip: () => {
            resolve(currentState, true)
          },
        },
      )
    } catch (e) {
      reject(e)
    }
  })
}

function convertDomainEventToJsonEvent({ eventName, payload }: DomainEvent) {
  return jsonEvent({
    type: eventName,
    data: payload,
  })
}

@Injectable()
// TODO edit this name to a more appropriate one; this service just not streaming anymore
export class ReadStreamService {
  constructor(private client: EventStoreDBClient) {}

  async sendDomainEventAsEsdbEvent(
    domainEvent: DomainEvent,
    expectedRevision: ExpectedRevision,
  ): Promise<void> {
    this.client.appendToStream(
      domainEvent.aggregateId,
      convertDomainEventToJsonEvent(domainEvent),
      {
        expectedRevision,
      },
    )
  }

  async readStreamFromBeginning<T>(
    streamName: string,
    reducer: Reducer<T>,
  ): Promise<IDerivedState<T>> {
    let currentDerivation: IDerivedState<T> = {
      state: null,
      revision: BigInt(-1),
    }

    try {
      while (true) {
        const streamEvents = await this.client.readStream(streamName, {
          maxCount: BATCH_SIZE,
          fromRevision: currentDerivation.revision + BigInt(1),
        })

        for (const resolved of streamEvents) {
          const { state, stop } = await reduce(
            currentDerivation,
            resolved,
            reducer,
          )

          currentDerivation = state

          if (stop) {
            return currentDerivation
          }
        }

        if (streamEvents.length < BATCH_SIZE) {
          return currentDerivation
        }
      }
    } catch (error) {
      // This is expected to be triggered during the first call.
      if (error.type === ErrorType.STREAM_NOT_FOUND) {
        return currentDerivation
      }

      throw error
    }
  }
}
