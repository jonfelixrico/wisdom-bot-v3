import { Logger } from '@nestjs/common'
import { EventBus, EventsHandler, IEventHandler, ofType } from '@nestjs/cqrs'
import { filter, take } from 'rxjs/operators'
import { EventConsumedEvent } from 'src/read-model-catch-up/event-consumed.event'
import { DomainEventPublishedEvent } from 'src/write-repositories/events/domain-event-published.event'
import { ReadModelSyncedEvent } from './../../read-model-synced.event'

@EventsHandler(DomainEventPublishedEvent)
export class EventSyncNotifierService
  implements IEventHandler<DomainEventPublishedEvent>
{
  constructor(private eventBus: EventBus, private logger: Logger) {}

  private get consumed$() {
    return this.eventBus.pipe(ofType(EventConsumedEvent))
  }

  private debug(message: string) {
    this.logger.log(message, EventSyncNotifierService.name)
  }

  /**
   * This will be triggered every time the write models published a new event.
   */
  handle({ event, revision }: DomainEventPublishedEvent) {
    const { aggregateId } = event
    this.debug(
      `Received published event ${aggregateId} @ ${revision}. Waiting for sync.`,
    )

    /*
     * Here, we're waiting for the read model to consume the ESDB counterpart of the said event.
     */
    this.consumed$
      .pipe(
        filter(
          (ce) => ce.streamName === aggregateId && ce.revision === revision,
        ),
        take(1),
      )
      .subscribe(() => {
        // With this, we've confirmed that the event has been synced with the read model. We're going to broadcast it.
        this.eventBus.publish(new ReadModelSyncedEvent(event))
        this.debug(`Synced event ${aggregateId} @ ${revision}.`)
      })
  }
}
