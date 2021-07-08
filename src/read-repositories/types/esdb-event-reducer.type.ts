import {
  JSONEventType,
  JSONRecordedEvent,
  JSONType,
} from '@eventstore/db-client'
import { EntityManager } from 'typeorm'

type ExtendedJsonType = JSONType | { [key: string]: any }

/**
 * This should be used for the reducers for consuming events for the read repository.
 */
export type EsdbEventReducer<
  EventDataType extends ExtendedJsonType = ExtendedJsonType,
> = (
  // This is directly taken from EventStoreDB
  event: JSONRecordedEvent<JSONEventType<string, EventDataType, unknown>>,
  // This is what we'll use to do TypeORM operations
  manager: EntityManager,
) => Promise<void>
