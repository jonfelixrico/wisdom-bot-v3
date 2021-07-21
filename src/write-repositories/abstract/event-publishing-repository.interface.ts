import { ExpectedRevision } from '@eventstore/db-client'
import { DomainEntity } from 'src/domain/abstracts/domain-entity.abstract'

export interface IEventPublishingRepository<Entity extends DomainEntity> {
  publishEvents(
    entity: Entity,
    expectedRevision: ExpectedRevision,
  ): Promise<void>
}
