import { ExpectedRevision } from '@eventstore/db-client'
import { DomainEntity } from 'src/domain/abstracts/domain-entity.abstract'
import { DomainEvent } from 'src/domain/abstracts/domain-event.abstract'

export interface IEsdbRepositoryEntity<Entity> {
  entity: Entity
  revision: bigint
}

export abstract class EsdbRepository<Entity extends DomainEntity> {
  abstract findById(id: string): Promise<IEsdbRepositoryEntity<Entity>>

  abstract publishEvents(
    entity: Entity,
    expectedRevision: ExpectedRevision,
  ): Promise<DomainEvent[]>
}
