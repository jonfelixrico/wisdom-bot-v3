import { IQuery } from '@nestjs/cqrs'

export interface IAuthorTopReceiversQueryInput {
  guildId: string
  limit: number
  userId: string
}

export type IAuthorTopReceiversQueryOutput = {
  userId: string
  receives: number
}[]

export class AuthorTopReceiversQuery implements IQuery {
  constructor(readonly input: IAuthorTopReceiversQueryInput) {}
}
