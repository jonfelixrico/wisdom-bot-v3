import { IQuery } from '@nestjs/cqrs'

export interface IUserTopReceiversQueryInput {
  guildId: string
  limit: number
  userId: string
}

export type IUserTopReceiversQueryOutput = {
  userId: string
  receives: number
}[]

export class UserTopReceiversQuery implements IQuery {
  constructor(readonly input: IUserTopReceiversQueryInput) {}
}
