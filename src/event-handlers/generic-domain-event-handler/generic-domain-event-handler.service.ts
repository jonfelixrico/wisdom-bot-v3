import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client'
import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { DomainEvent } from 'src/domain/domain-event.abstract'
import { Inject, Logger } from '@nestjs/common'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'

@EventsHandler()
export class GenericDomainEventHandlerService
  implements IEventHandler<DomainEvent<unknown>>
{
  constructor(
    private esdbClient: EventStoreDBClient,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: Logger,
  ) {}

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
