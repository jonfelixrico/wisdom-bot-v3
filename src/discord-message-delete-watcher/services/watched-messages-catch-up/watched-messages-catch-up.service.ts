import {
  AllStreamJSONRecordedEvent,
  AllStreamResolvedEvent,
  EventStoreDBClient,
  Position,
  START,
} from '@eventstore/db-client'
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { fromEvent } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { WrappedRedisClient } from 'src/discord-message/wrapped-redis-client.class'
import {
  WATCHED_MESSAGES_REDUCERS,
  serializePosition,
} from 'src/discord-message-delete-watcher/watched-messages.reducers'

const POSITION_KEY = 'POSITION'
const READ_MAX_COUNT = 1000

@Injectable()
export class WatchedMessagesCatchUp implements OnApplicationBootstrap {
  private currentPosition: Position

  constructor(
    private esdb: EventStoreDBClient,
    private logger: Logger,
    private redis: WrappedRedisClient,
  ) {}

  private async retrievePosition() {
    const serializedPos = await this.redis.get(POSITION_KEY)

    if (serializedPos) {
      const [commit, prepare] = serializedPos.split('/')
      this.currentPosition = {
        commit: BigInt(commit),
        prepare: BigInt(prepare),
      }
    }

    return this.currentPosition
  }

  async processEvent({ event }: AllStreamResolvedEvent) {
    const { position, type, isJson } = event
    this.currentPosition = position

    // events that start with '$' are system events. we don't need those
    if (type.startsWith('$') || !isJson) {
      return
    }

    const reducerFn = WATCHED_MESSAGES_REDUCERS[type]
    if (!reducerFn) {
      await this.redis.set(POSITION_KEY, serializePosition(position))
      return
    }

    await reducerFn(event as AllStreamJSONRecordedEvent, this.redis)
  }

  private async doCatchingUp() {
    let batchCtr = 0

    while (true) {
      const resolvedEvents = await this.esdb.readAll({
        fromPosition: this.currentPosition ?? START,
        maxCount: READ_MAX_COUNT,
      })

      for (const event of resolvedEvents) {
        const { commit, prepare } = event.event.position
        const { currentPosition } = this

        if (
          currentPosition &&
          commit === currentPosition.commit &&
          prepare === currentPosition.prepare
        ) {
          /*
           * This can happen with the first item of subsequent batches. The event at the position that we
           * provided in `fromPosition` is included in the result set.
           */
          continue
        }

        await this.processEvent(event)
      }

      const batchNo = batchCtr++

      if (resolvedEvents.length) {
        this.logger.verbose(
          `Processed ${resolvedEvents.length} events in batch ${batchNo + 1}`,
        )
      }

      if (resolvedEvents.length < READ_MAX_COUNT) {
        return
      }
    }
  }

  private async streamEvents() {
    fromEvent<AllStreamResolvedEvent>(
      this.esdb.subscribeToAll({
        fromPosition: this.currentPosition,
      }),
      'data',
    )
      .pipe(mergeMap((e) => this.processEvent(e), 1))
      .subscribe()
  }

  async onApplicationBootstrap() {
    this.logger.log(
      'Starting catch-up for the cache model.',
      WatchedMessagesCatchUp.name,
    )
    await this.retrievePosition()
    await this.doCatchingUp()

    this.logger.log(
      'Catch-up finished, now watching for live events.',
      WatchedMessagesCatchUp.name,
    )

    this.streamEvents()
  }
}
