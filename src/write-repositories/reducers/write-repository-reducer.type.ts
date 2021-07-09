export type WriteRepositoryReducer<
  StateType extends Record<string, any> = Record<string, any>,
  DataType = any,
> = (data: DataType, state: StateType) => StateType

export type WriteRepositoryReducerMap = {
  [key: string]: WriteRepositoryReducer
}
