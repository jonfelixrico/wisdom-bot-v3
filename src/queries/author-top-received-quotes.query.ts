import { IQuery } from '@nestjs/cqrs'

export interface AuthorTopReceivedQuotesQueryInput {
  guildId: string
  limit: number
  authorId: string
}

export type AuthorTopReceivedQuotesQueryOutput = {
  quoteId: string
  content: string
  receives: number
}[]

export class AuthorTopReceivedQuotesQuery implements IQuery {}
