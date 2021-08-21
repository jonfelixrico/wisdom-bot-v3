import { IQuery } from '@nestjs/cqrs'

export interface IGuildTopReceiversQueryInput {
  guildId: string
  limit: number
}

export type IGuildTopReceiversQueryOutput = {
  userId: string
  receives: number
}[]

export class GuildTopReceiversQuery implements IQuery {
  constructor(readonly input: IGuildTopReceiversQueryInput) {}
}
