import { ReadRepositoryReducer } from './read-repository-reducer.type'

export type ReducerMap<KeyType extends string = string> = Record<
  KeyType,
  ReadRepositoryReducer
>
