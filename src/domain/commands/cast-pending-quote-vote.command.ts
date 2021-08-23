import { ICommand } from '@nestjs/cqrs'

export interface ICastPendingQuoteVoteCommandPayload {
  quoteId: string
  userId: string
  voteValue: number
}

export class CastPendingQuoteVoteCommand implements ICommand {
  constructor(readonly payload: ICastPendingQuoteVoteCommandPayload) {}
}
