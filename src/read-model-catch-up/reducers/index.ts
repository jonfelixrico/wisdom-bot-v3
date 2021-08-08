import { QUOTE_REDUCERS } from './quote.reducers'
import { RECEIVE_REDUCERS } from './receive.reducers'
import { GUILD_REDUCERS } from './guild.reducers'
import { TypeormReducerMap } from '../../types/typeorm-reducers.types'

export const REDUCER_MAP: TypeormReducerMap = {
  ...QUOTE_REDUCERS,
  ...RECEIVE_REDUCERS,
  ...GUILD_REDUCERS,
}
