import { IQuery } from '@nestjs/cqrs'
import { IQuoteSettings, ISettings } from 'src/domain/entities/guild.interfaces'

export interface IGuildQueryOuptut {
  quoteSettings: IQuoteSettings
  settings: ISettings

  // `doesExist` tells the query handler to return the guild default values if the guild is not found
  doesExist?: boolean
}

export interface IGuildQueryInput {
  guildId: string
  existingOnly?: boolean
}

export class GuildQuery implements IQuery {
  constructor(readonly input: IGuildQueryInput) {}
}
