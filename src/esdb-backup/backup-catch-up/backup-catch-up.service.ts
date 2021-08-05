import {
  AllStreamResolvedEvent,
  EventStoreDBClient,
  JSONType,
  Position,
  START,
} from '@eventstore/db-client'
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { fromEvent } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { Connection } from 'typeorm'
import { EventTypeormEntity } from '../event.typeorm-entity'
const READ_MAX_COUNT = 1000

@Injectable()
export class BackupCatchUpService implements OnApplicationBootstrap {
  private currentPosition: Position

  constructor(
    private conn: Connection,
    private client: EventStoreDBClient,
    private logger: Logger,
  ) {}

  get eventRepository() {
    return this.conn.getRepository(EventTypeormEntity)
  }

  async processEvent({ event }: AllStreamResolvedEvent) {
    const { data, streamId, position, id, type, isJson } = event
    const { commit, prepare } = position

    this.currentPosition = position

    // events that start with '$' are system events. we don't need those
    if (type.startsWith('$') || !isJson) {
      return
    }

    await this.eventRepository.insert({
      commit,
      prepare,
      data: data as JSONType,
      eventId: id,
      streamId,
      type,
    })
  }

  async retrievePosition() {
    const lastEvent = await this.eventRepository
      .createQueryBuilder()
      .orderBy('rowNo', 'DESC')
      .getOne()

    if (!lastEvent) {
      return
    }

    const { prepare, commit } = lastEvent

    this.currentPosition = {
      prepare,
      commit,
    }

    return this.currentPosition
  }

  private async doCatchingUp() {
    let batchCount = 0
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

      if (resolvedEvents.length) {
        this.logger.debug(
          `Processed ${resolvedEvents.length} events for batch ${
            batchCount + 1
          }.`,
          BackupCatchUpService.name,
        )
      }
      batchCount++

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
    this.logger.log(
      'Starting catch-up for the backup...',
      BackupCatchUpService.name,
    )
    await this.retrievePosition()
    await this.doCatchingUp()
    this.logger.log('Catch-up done.', BackupCatchUpService.name)
    this.streamEvents()
  }
}
