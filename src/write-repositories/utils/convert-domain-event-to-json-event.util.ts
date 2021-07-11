import { jsonEvent } from '@eventstore/db-client'
import { DomainEvent } from 'src/domain/abstracts/domain-event.abstract'

export const convertDomainEventToJsonEvent = ({
  eventName,
  payload,
}: DomainEvent) =>
  jsonEvent({
    data: payload,
    type: eventName,
  })
