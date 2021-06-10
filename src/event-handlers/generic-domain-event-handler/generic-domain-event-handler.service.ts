import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client'
import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { Event } from 'src/domain/event.abstract'

@EventsHandler()
export class GenericDomainEventHandlerService
  implements IEventHandler<Event<unknown>>
{
  constructor(private esdbClient: EventStoreDBClient) {}

  async handle(event: Event<unknown>) {
    if (!(event instanceof Event)) {
      return
    }

    const { eventName, aggregateId } = event
    const payload = event.payload ?? {}

    const esdbEvent = jsonEvent({
      type: eventName,
      data: payload,
    })

    await this.esdbClient.appendToStream(aggregateId, [esdbEvent])
  }
}
