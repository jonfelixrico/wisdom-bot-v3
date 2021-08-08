import { IQuery } from '@nestjs/cqrs'

export type IGuildTopContributorsQueryOutput = {
  userId: string
  contributions: number
}[]

export interface IGuildTopContributorsQueryInput {
  guildId: string
  limit: number
}

export class GuildTopContributorsQuery implements IQuery {
  constructor(readonly input: IGuildTopContributorsQueryInput) {}
}
