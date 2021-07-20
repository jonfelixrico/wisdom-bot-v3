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
