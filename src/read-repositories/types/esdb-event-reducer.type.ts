import {
  JSONEventType,
  JSONRecordedEvent,
  JSONType,
} from '@eventstore/db-client'
import { EntityManager } from 'typeorm'

type ExtendedJsonType = JSONType | { [key: string]: any }

export type EsdbEventReducer<
  EventDataType extends ExtendedJsonType = ExtendedJsonType,
> = (
  event: JSONRecordedEvent<JSONEventType<string, EventDataType, unknown>>,
  transaction: EntityManager,
) => Promise<void>
