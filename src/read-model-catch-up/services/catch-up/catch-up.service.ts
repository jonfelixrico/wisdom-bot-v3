import {
  AllStreamJSONRecordedEvent,
  AllStreamResolvedEvent,
  EventStoreDBClient,
  Position,
  ReadPosition,
} from '@eventstore/db-client'
import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { EventBus } from '@nestjs/cqrs'
import { fromEvent } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { CatchUpFinishedEvent } from 'src/read-model-catch-up/catch-up-finished.event'
import { EventConsumedEvent } from 'src/read-model-catch-up/event-consumed.event'
import { MapTypeormEntity } from 'src/typeorm/entities/map.typeorm-entity'
import { Connection, EntityManager, Repository } from 'typeorm'
import { REDUCER_MAP } from './../../reducers/index'

const POSITION_KEY = 'POSITION'
const READ_MAX_COUNT = 1000

@Injectable()
export class CatchUpService implements OnApplicationBootstrap {
  private currentPosition: ReadPosition = 'start'
  private readonly mapRepo: Repository<MapTypeormEntity>

  constructor(
    private conn: Connection,
    private client: EventStoreDBClient,
    private eventBus: EventBus,
  ) {
    this.mapRepo = conn.getRepository(MapTypeormEntity)
  }

  async updatePosition(manager: EntityManager, position: Position) {
    this.currentPosition = position
    await this.mapRepo.save({
      key: POSITION_KEY,
      value: [position.commit, position.prepare].join('/'),
    })
  }

  async processEvent({ event }: AllStreamResolvedEvent) {
    const { position, type, isJson } = event
    return this.conn.transaction(async (manager) => {
      await this.updatePosition(manager, position)

      // events that start with '$' are system events. we don't need those
      if (type.startsWith('$') || !isJson) {
        return
      }

      const reducerFn = REDUCER_MAP[type]
      const isConsumed = await reducerFn(
        event as AllStreamJSONRecordedEvent,
        manager,
      )

      if (isConsumed) {
        this.eventBus.publish(
          new EventConsumedEvent(event.streamId, event.revision),
        )
      }
    })
  }

  async retrievePosition() {
    const position = await this.mapRepo.findOne({ key: POSITION_KEY })
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
        fromPosition: this.currentPosition,
        maxCount: READ_MAX_COUNT,
      })

      for (const event of resolvedEvents) {
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
    await this.retrievePosition()
    await this.doCatchingUp()
    this.eventBus.publish(new CatchUpFinishedEvent())
    this.streamEvents()
  }
}
