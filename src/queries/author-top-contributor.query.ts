import { IQuery } from '@nestjs/cqrs'

export type IAuthorTopContributorsQueryOutput = {
  userId: string
  contributions: number
}[]

export interface IAuthorTopContributorsQueryInput {
  authorId: string
  guildId: string
  limit: number
}

export class AuthorTopContributorsQuery implements IQuery {
  constructor(readonly input: IAuthorTopContributorsQueryInput) {}
}
