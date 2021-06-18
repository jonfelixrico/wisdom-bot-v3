interface IEsdbRepository<Entity> {
  entity: Entity
  revision: bigint
}

export abstract class EsdbRepository<Entity> {
  abstract findById(id: string): Promise<IEsdbRepository<Entity>>
}
