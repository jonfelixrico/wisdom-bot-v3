import { JSONRecordedEvent } from '@eventstore/db-client'
import { EntityManager } from 'typeorm'

export type EsdbEventReducer = (
  event: JSONRecordedEvent,
  transaction: EntityManager,
) => Promise<void>
