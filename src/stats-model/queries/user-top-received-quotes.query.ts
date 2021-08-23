import { IQuery } from '@nestjs/cqrs'

export interface IUserTopAuthoredQuotesQueryInput {
  guildId: string
  limit: number
  userId: string
}

export type IUserTopAuthoredQuotesQueryOutput = {
  quoteId: string
  content: string
  receives: number
}[]

export class UserTopAuthoredQuotesQuery implements IQuery {
  constructor(readonly input: IUserTopAuthoredQuotesQueryInput) {}
}
