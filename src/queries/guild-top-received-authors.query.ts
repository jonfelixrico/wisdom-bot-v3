import { IQuery } from '@nestjs/cqrs'

export interface IGuildTopReceivedAuthorsQueryInput {
  limit: number
  guildId: string
}

export type IGuildTopReceivedAuthorsQueryOutput = {
  authorId: string
  receives: number
}[]

export class GuildTopReceivedAuthorsQuery implements IQuery {}
