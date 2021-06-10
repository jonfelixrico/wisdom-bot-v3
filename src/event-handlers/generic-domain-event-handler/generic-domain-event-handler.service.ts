import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { Event } from 'src/domain/event.abstract'

@EventsHandler()
export class GenericDomainEventHandlerService
  implements IEventHandler<Event<unknown>>
{
  handle(event: Event<unknown>) {
    if (!(event instanceof Event)) {
      return
    }

    // TODO convert to event source here
  }
}
