import { JSONRecordedEvent } from '@eventstore/db-client'
import { WriteRepositoryReducerMap } from './write-repository-reducer.type'

export function writeRepositoryReducerDispatcherFactory<Entity>(
  reducerMap: WriteRepositoryReducerMap<Entity>,
) {
  return (state: Entity, { data, type }: JSONRecordedEvent) => {
    const reducer = reducerMap[type]
    return reducer ? reducer(data, state) : state
  }
}

export function reduceEvents<Entity>(
  events: JSONRecordedEvent[],
  reducerMap: WriteRepositoryReducerMap<Entity>,
): [Entity, bigint] {
  if (!events.length) {
    return null
  }

  const reduceFn = writeRepositoryReducerDispatcherFactory(reducerMap)
  const entity = events.reduce(reduceFn, null)
  const lastEvent = events[events.length - 1]

  return [entity, lastEvent.revision]
}
