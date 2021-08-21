import { IQuery } from '@nestjs/cqrs'

export interface IGuildStatsQueryOutput {
  guildId: string
  quotes: number
  receives: number
  // TODO add reactions
}

export class GuildStatsQuery implements IQuery {
  constructor(readonly guildId: string) {}
}
