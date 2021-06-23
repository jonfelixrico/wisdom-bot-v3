import { EventBus, IEventHandler } from '@nestjs/cqrs'
import { Logger, OnModuleInit } from '@nestjs/common'
import { filter, mergeMap } from 'rxjs/operators'
import { ReadModelBuildMessage } from 'src/read-model-builder-services/classes/read-model-build-message.event'

export abstract class EventHandlerWithConcurrencyLimit<
  EventType extends ReadModelBuildMessage,
> implements IEventHandler<EventType>, OnModuleInit
{
  abstract handle(event: EventType): any | Promise<any>
  abstract readonly CONCURRENT_LIMIT: number
  abstract readonly LOGGER_CONTEXT: string

  constructor(
    protected eventBus: EventBus<EventType>,
    protected logger: Logger,
  ) {}

  onModuleInit() {
    const { eventBus, CONCURRENT_LIMIT, LOGGER_CONTEXT } = this

    eventBus
      .pipe(
        filter((e) => e instanceof ReadModelBuildMessage),
        mergeMap(async (e) => {
          try {
            await this.handle(e)
          } catch (e) {
            const error = e as Error
            this.logger.error(
              `Uncaught exception: ${error.message}`,
              error.stack,
              LOGGER_CONTEXT,
            )
          }
        }, CONCURRENT_LIMIT),
      )
      .subscribe()
  }
}
