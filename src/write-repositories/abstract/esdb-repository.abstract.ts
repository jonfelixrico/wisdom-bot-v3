import { ExpectedRevision } from '@eventstore/db-client'
import { DomainEntity } from 'src/domain/abstracts/domain-entity.abstract'
import { IEventPublishingRepository } from './event-publishing-repository.interface'

export interface IEsdbRepositoryEntity<Entity> {
  entity: Entity
  revision: bigint
}

export abstract class EsdbRepository<Entity extends DomainEntity>
  implements IEventPublishingRepository<Entity>
{
  abstract publishEvents(
    entity: Entity,
    expectedRevision: ExpectedRevision,
  ): Promise<void>

  abstract findById(id: string): Promise<IEsdbRepositoryEntity<Entity>>
}
