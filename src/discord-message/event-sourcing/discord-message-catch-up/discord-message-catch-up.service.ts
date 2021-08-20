import {
  AllStreamResolvedEvent,
  EventStoreDBClient,
  Position,
  START,
} from '@eventstore/db-client'
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { EventBus } from '@nestjs/cqrs'
import { Multi, RedisClient } from 'redis'
import { fromEvent } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { QuoteMessageTypeormEntity } from 'src/discord-message/db/quote-message.typeorm-entity'
import { MapTypeormEntity } from 'src/typeorm/entities/map.typeorm-entity'
import { Connection, EntityManager } from 'typeorm'
import { promisify } from 'util'
import { DiscordMessageCatchUpFinishedEvent } from '../discord-message-catch-up-finished.event'
import { MESSAGE_REDUCERS } from '../discord-message.reducers'

const POSITION_KEY = 'POSITION'
const READ_MAX_COUNT = 1000

@Injectable()
export class DiscordMessageCatchUpService implements OnApplicationBootstrap {
  private currentPosition: Position

  constructor(
    private conn: Connection,
    private client: EventStoreDBClient,
    private eventBus: EventBus,
    private logger: Logger,
    private redis: RedisClient,
  ) {}

  async updatePosition(manager: EntityManager, position: Position) {
    this.currentPosition = position
    await manager.save(MapTypeormEntity, {
      key: POSITION_KEY,
      value: [position.commit, position.prepare].join('/'),
    })
  }

  async doReduce(
    manager: EntityManager,
    multi: Multi,
    { event }: AllStreamResolvedEvent,
  ) {
    const { position, type, isJson, data } = event
    await this.updatePosition(manager, position)

    // events that start with '$' are system events. we don't need those
    if (type.startsWith('$') || !isJson) {
      return
    }

    const reducerFn = MESSAGE_REDUCERS[type]
    const isConsumed = await reducerFn(
      data,
      manager.getRepository(QuoteMessageTypeormEntity),
      multi,
    )

    return isConsumed
  }

  async processEvent(event: AllStreamResolvedEvent) {
    const runner = this.conn.createQueryRunner()
    try {
      await runner.connect()
      await runner.startTransaction()
      const multi = this.redis.multi()

      const isConsumed = await this.doReduce(runner.manager, multi, event)

      if (isConsumed) {
        await runner.commitTransaction()
        await promisify(multi.exec).call(multi)
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
    let batchCtr = 0
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

      const batchNo = batchCtr++

      if (resolvedEvents.length) {
        this.logger.verbose(
          `Processed ${resolvedEvents.length} in batch ${batchNo + 1}`,
          DiscordMessageCatchUpService.name,
        )
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
      'Starting discord message model catch up...',
      DiscordMessageCatchUpService.name,
    )
    await this.retrievePosition()
    await this.doCatchingUp()

    logger.log('Done with catching-up.', DiscordMessageCatchUpService.name)

    this.eventBus.publish(new DiscordMessageCatchUpFinishedEvent())
    this.streamEvents()
  }
}
