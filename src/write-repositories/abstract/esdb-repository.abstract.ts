interface IEsdbRepository<Entity> {
  entity: Entity
  revision: number
}

export abstract class EsdbRepository<Entity> {
  abstract findById: Promise<IEsdbRepository<Entity>>
}
