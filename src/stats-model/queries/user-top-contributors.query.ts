import { IQuery } from '@nestjs/cqrs'

export type IUserTopContributorsQueryOutput = {
  userId: string
  contributions: number
}[]

export interface IUserTopContributorsQueryInput {
  userId: string
  guildId: string
  limit: number
}

export class UserTopContributorsQuery implements IQuery {
  constructor(readonly input: IUserTopContributorsQueryInput) {}
}
