import { IQuery } from '@nestjs/cqrs'

export interface IUserStatsQueryInput {
  userId: string
  guildId: string
}

export interface IUserStatsQueryOutput {
  submissions: number
  receives: number
  userId: string
  guildId: string
}

export class UserStatsQuery implements IQuery {
  constructor(readonly input: IUserStatsQueryInput) {}
}
