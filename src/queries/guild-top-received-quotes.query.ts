import { IQuery } from '@nestjs/cqrs'

export interface IGuildTopReceivedQuotesQueryInput {
  guildId: string
  limit: number
}

export type IGuildTopReceivedQuotesQueryOutput = {
  quoteId: string
  content: string
  authorId: string
  receives: number
}[]

export class GuildTopReceivedQuotesQuery implements IQuery {
  constructor(readonly input: IGuildTopReceivedQuotesQueryInput) {}
}
