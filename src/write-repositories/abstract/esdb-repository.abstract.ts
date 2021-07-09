import { DomainEntity } from 'src/domain/abstracts/domain-entity.abstract'

export interface IEsdbRepositoryEntity<Entity> {
  entity: Entity
  revision: bigint
}

export abstract class EsdbRepository<Entity extends DomainEntity> {
  abstract findById(id: string): Promise<IEsdbRepositoryEntity<Entity>>
}
