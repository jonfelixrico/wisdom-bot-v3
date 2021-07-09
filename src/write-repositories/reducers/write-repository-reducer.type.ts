export type WriteRepositoryReducer<
  CurrentStateType extends Record<string, any> = Record<string, any>,
  DataType = any,
  UpdatedStateType extends Record<string, any> = CurrentStateType,
> = (data: DataType, state: CurrentStateType) => UpdatedStateType

export type WriteRepositoryReducerMap = {
  [key: string]: WriteRepositoryReducer
}
