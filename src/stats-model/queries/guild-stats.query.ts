import { IQuery } from '@nestjs/cqrs'

export interface IGuildStatsQueryOutput {
  guildId: string
  quotes: number
  receives: number
}

export interface IGuildStatsQueryInput {
  guildId: string
}

export class GuildStatsQuery implements IQuery {
  constructor(readonly input: IGuildStatsQueryInput) {}
}
