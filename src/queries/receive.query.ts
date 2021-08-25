import { IQuery } from '@nestjs/cqrs'
import { IReceiveEntity } from 'src/domain/entities/receive.entity'

export interface IReceiveQueryOutput extends IReceiveEntity {
  receiveCountSnapshot: number
}

export interface IReceiveQueryInput {
  receiveId: string
}

export class ReceiveQuery implements IQuery {
  constructor(readonly input: IReceiveQueryInput) {}
}
