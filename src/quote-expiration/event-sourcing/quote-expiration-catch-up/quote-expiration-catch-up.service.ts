import {
  AllStreamJSONRecordedEvent,
  AllStreamResolvedEvent,
  EventStoreDBClient,
  Position,
  START,
} from '@eventstore/db-client'
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { EventBus } from '@nestjs/cqrs'
import { fromEvent } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { EventConsumedEvent } from 'src/read-model-catch-up/event-consumed.event'
import { MapTypeormEntity } from 'src/typeorm/entities/map.typeorm-entity'
import { Connection, EntityManager } from 'typeorm'
import { EXPIRATION_REDUCERS } from './../quote-expiration.reducers'

const POSITION_KEY = 'POSITION'
const READ_MAX_COUNT = 1000

@Injectable()
export class QuoteExpirationCatchUpService implements OnApplicationBootstrap {
  private currentPosition: Position

  constructor(
    private conn: Connection,
    private client: EventStoreDBClient,
    private eventBus: EventBus,
    private logger: Logger,
  ) {}

  async updatePosition(manager: EntityManager, position: Position) {
    this.currentPosition = position
    await manager.save(MapTypeormEntity, {
      key: POSITION_KEY,
      value: [position.commit, position.prepare].join('/'),
    })
  }

  async doReduce(manager: EntityManager, { event }: AllStreamResolvedEvent) {
    const { position, type, isJson } = event
    await this.updatePosition(manager, position)

    // events that start with '$' are system events. we don't need those
    if (type.startsWith('$') || !isJson) {
      return
    }

    const reducerFn = EXPIRATION_REDUCERS[type]
    const isConsumed = await reducerFn(
      event as AllStreamJSONRecordedEvent,
      manager,
    )

    if (isConsumed) {
      this.eventBus.publish(
        new EventConsumedEvent(event.streamId, event.revision),
      )
    }

    return isConsumed
  }

  async processEvent(event: AllStreamResolvedEvent) {
    const runner = this.conn.createQueryRunner()
    try {
      await runner.connect()
      await runner.startTransaction()

      const isConsumed = await this.doReduce(runner.manager, event)

      if (isConsumed) {
        await runner.commitTransaction()
      } else {
        await runner.rollbackTransaction()
      }
    } catch (e) {
      await runner.rollbackTransaction()
    } finally {
      await runner.release()
    }
  }

  async retrievePosition() {
    const position = await this.conn
      .getRepository(MapTypeormEntity)
      .findOne({ key: POSITION_KEY })

    if (position) {
      const [commit, prepare] = position.value.split('/')
      this.currentPosition = {
        commit: BigInt(commit),
        prepare: BigInt(prepare),
      }
    }

    return this.currentPosition
  }

  private async doCatchingUp() {
    while (true) {
      const resolvedEvents = await this.client.readAll({
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

      if (resolvedEvents.length < READ_MAX_COUNT) {
        return
      }
    }
  }

  private async streamEvents() {
    fromEvent<AllStreamResolvedEvent>(
      this.client.subscribeToAll({
        fromPosition: this.currentPosition,
      }),
      'data',
    )
      .pipe(mergeMap((e) => this.processEvent(e), 1))
      .subscribe()
  }

  async onApplicationBootstrap() {
    const { logger } = this

    logger.log(
      'Starting expiration model catch up...',
      QuoteExpirationCatchUpService.name,
    )
    await this.retrievePosition()
    await this.doCatchingUp()

    logger.log('Done with catching-up.', QuoteExpirationCatchUpService.name)
    this.streamEvents()
  }
}
