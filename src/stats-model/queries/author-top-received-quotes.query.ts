import { IQuery } from '@nestjs/cqrs'

export interface IAuthorTopReceivedQuotesQueryInput {
  guildId: string
  limit: number
  authorId: string
}

export type IAuthorTopReceivedQuotesQueryOutput = {
  quoteId: string
  content: string
  receives: number
}[]

export class AuthorTopReceivedQuotesQuery implements IQuery {
  constructor(readonly input: IAuthorTopReceivedQuotesQueryInput) {}
}
