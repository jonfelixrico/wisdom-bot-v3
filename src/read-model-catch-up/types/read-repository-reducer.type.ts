import {
  JSONEventType,
  JSONRecordedEvent,
  JSONType,
} from '@eventstore/db-client'
import { EntityManager } from 'typeorm'

/**
 * This should be used for the reducers for consuming events for the read repository.
 */
export type ReadRepositoryReducer<EventDataType extends JSONType = JSONType> = (
  // This is directly taken from EventStoreDB
  event: JSONRecordedEvent<JSONEventType<string, EventDataType, unknown>>,
  // This is what we'll use to do TypeORM operations
  manager: EntityManager,
) => Promise<boolean> // true if processed, false if skipped
