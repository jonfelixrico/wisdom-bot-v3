import { IQuery } from '@nestjs/cqrs'

export class GetPendingQuoteByMessageIdQuery implements IQuery {
  constructor(readonly messageId: string) {}
}
