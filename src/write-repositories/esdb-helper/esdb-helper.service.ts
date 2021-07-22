import {
  ErrorType,
  EventStoreDBClient,
  JSONRecordedEvent,
} from '@eventstore/db-client'
import { Injectable } from '@nestjs/common'

@Injectable()
export class EsdbHelperService {
  constructor(private client: EventStoreDBClient) {}

  async readAllEvents(streamName: string) {
    try {
      const resolvedEvents = await this.client.readStream(streamName)
      return resolvedEvents.map(({ event }) => event as JSONRecordedEvent)
    } catch (e) {
      if (e.type === ErrorType.STREAM_NOT_FOUND) {
        return null
      }

      throw e
    }
  }
}
