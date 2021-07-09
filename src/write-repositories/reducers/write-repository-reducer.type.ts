export type WriteRepositoryReducer<
  DataType = unknown,
  CurrentStateType extends Record<string, any> = unknown,
  UpdatedStateType extends Record<string, any> = CurrentStateType,
> = (data: DataType, state: CurrentStateType) => UpdatedStateType

export type WriteRepositoryReducerMap<
  StateType extends Record<string, any> = unknown,
> = {
  [key: string]: WriteRepositoryReducer<unknown, unknown, StateType>
}
