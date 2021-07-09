export type WriteRepositoryReducer<
  DataType = unknown,
  CurrentStateType extends Record<string, any> = unknown,
  UpdatedStateType extends Record<string, any> = CurrentStateType,
> = (data: DataType, state: CurrentStateType) => UpdatedStateType

export type WriteRepositoryReducerMap = {
  [key: string]: WriteRepositoryReducer
}
