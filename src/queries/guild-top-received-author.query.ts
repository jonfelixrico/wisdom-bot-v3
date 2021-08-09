import { IQuery } from '@nestjs/cqrs'

export interface IGuildTopReceivedAuthorQueryInput {
  limit: number
  guildId: string
}

export type IGuildTopReceivedAuthorQueryOutput = {
  authorId: string
  receives: number
}[]

export class GuildTopReceivedAuthorQuery implements IQuery {}
