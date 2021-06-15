import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client'
import { EventBus, IEventHandler } from '@nestjs/cqrs'
import { DomainEvent } from 'src/domain/domain-event.abstract'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class GenericDomainEventHandlerService
  implements IEventHandler<DomainEvent<unknown>>
{
  constructor(
    private esdbClient: EventStoreDBClient,
    private logger: Logger,
    private eventBus: EventBus,
  ) {
    this.eventBus.subscribe(this.handle.bind(this))
  }

  async handle(event: DomainEvent<unknown>) {
    if (!(event instanceof DomainEvent)) {
      return
    }

    const { eventName, aggregateId } = event
    const payload = event.payload ?? {}

    const esdbEvent = jsonEvent({
      type: eventName,
      data: payload,
    })

    await this.esdbClient.appendToStream(aggregateId, [esdbEvent])
    this.logger.debug(
      `Processed event ${eventName} for stream ${aggregateId}`,
      GenericDomainEventHandlerService.name,
    )
  }
}
