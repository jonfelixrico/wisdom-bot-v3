import { IQuery } from '@nestjs/cqrs'

export type IGuildTopKarmaQuotesQueryOutput = {
  quoteId: string
  content: string
  karma: number
  reactions: number
  authorId: string
}[]

export interface IGuildTopKarmaQuotesQueryInput {
  guildId: string
  limit: number
}

export class GuildTopKarmaQuotesQuery implements IQuery {
  constructor(readonly input: IGuildTopKarmaQuotesQueryInput) {}
}
