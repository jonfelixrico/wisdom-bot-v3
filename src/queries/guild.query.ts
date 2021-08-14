import { IQuery } from '@nestjs/cqrs'
import { IQuoteSettings, ISettings } from 'src/domain/entities/guild.interfaces'

export interface IGuildQueryInput {
  guildId: string

  // tells the query handler to return the guild default values instead if the guild is not found
  existingOnly?: boolean
}

export interface IGuildQueryOuptut {
  quoteSettings: IQuoteSettings
  settings: ISettings

  // plays with `existingOnly`; will be true if the value that was returned was from actual guild record and not just defaults
  doesExist?: boolean
}

/**
 * Query for guild information.
 */
export class GuildQuery implements IQuery {
  constructor(readonly input: IGuildQueryInput) {}
}
