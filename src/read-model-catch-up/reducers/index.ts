import { ReducerMap } from '../types/reducer-map.type'
import { QUOTE_REDUCERS } from './quote.reducers'
import { RECEIVE_REDUCERS } from './receive.reducers'

export const REDUCER_MAP: ReducerMap = {
  ...QUOTE_REDUCERS,
  ...RECEIVE_REDUCERS,
}
