import { Injectable } from '@nestjs/common'
import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { PendingQuote } from 'src/domain/entities/pending-quote.entity'
import {
  ReadStreamService,
  Reducer,
} from 'src/write-repositories/read-stream/read-stream.service'
import { ResolvedEvent } from '@eventstore/db-client'
import { IPendingQuoteCancelledPayload } from 'src/domain/events/pending-quote-cancelled.event'
import { IPendingQuote } from 'src/domain/entities/pending-quote.interface'
import { EsdbRepository } from '../abstract/esdb-repository.abstract'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function quoteSubmitted(state: IPendingQuote, data: IPendingQuote) {
  return data
}

function quoteCancelled(
  state: IPendingQuote,
  { cancelDt }: IPendingQuoteCancelledPayload,
) {
  state.cancelDt = cancelDt
  return state
}

const { PENDING_QUOTE_ACCEPTED, PENDING_QUOTE_CANCELLED, QUOTE_SUBMITTED } =
  DomainEventNames

const ReducerMapping = {
  [PENDING_QUOTE_CANCELLED]: quoteCancelled,
  [QUOTE_SUBMITTED]: quoteSubmitted,
}

export const pendingQuoteReducer: Reducer<IPendingQuote> = (
  state: IPendingQuote,
  { event }: ResolvedEvent,
  next,
  { stop },
) => {
  const { type, data } = event
  if (type === PENDING_QUOTE_ACCEPTED) {
    stop(null)
    return
  }

  next(ReducerMapping[type](state, data))
}

@Injectable()
export class PendingQuoteWriteRepositoryService extends EsdbRepository<PendingQuote> {
  constructor(private readStream: ReadStreamService) {
    super()
  }

  async findById(id: string) {
    const { state, revision } = await this.readStream.readStreamFromBeginning(
      id,
      pendingQuoteReducer,
    )

    return {
      entity: new PendingQuote(state),
      revision,
    }
  }
}
