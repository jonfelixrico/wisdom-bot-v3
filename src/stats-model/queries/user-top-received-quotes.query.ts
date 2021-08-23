import { IQuery } from '@nestjs/cqrs'

export interface IUserTopReceivedQuotesQueryInput {
  guildId: string
  limit: number
  authorId: string
}

export type IUserTopReceivedQuotesQueryOutput = {
  quoteId: string
  content: string
  receives: number
}[]

export class UserTopReceivedQuotesQuery implements IQuery {
  constructor(readonly input: IUserTopReceivedQuotesQueryInput) {}
}
