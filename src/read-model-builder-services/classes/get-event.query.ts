import { IQuery } from '@nestjs/cqrs'

export class GetEventQuery implements IQuery {
  constructor(readonly streamId: string, readonly revision: bigint) {}
}
