import { IQuery } from '@nestjs/cqrs'
import { IQuoteEntity } from 'src/domain/entities/quote.entity'
import { IReceiveEntity } from 'src/domain/entities/receive.entity'

export interface IReceiveQueryOutput extends IReceiveEntity {
  receiveCountSnapshot: number
  quote: IQuoteEntity
}

export interface IReceiveQueryInput {
  receiveId: string
}

export class ReceiveQuery implements IQuery {
  constructor(readonly input: IReceiveQueryInput) {}
}
