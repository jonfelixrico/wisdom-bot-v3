import { IQuery } from '@nestjs/cqrs'
import { IQuoteSettings, ISettings } from 'src/domain/entities/guild.interfaces'

export interface IGuildQueryOuptut {
  id: string
  quoteSettings: IQuoteSettings
  settings: ISettings

  doesExist?: boolean
}

export interface IGuildQueryInput {
  guildId: string
  existingOnly?: boolean
}

export class GuildQuery implements IQuery {
  constructor(readonly input: IGuildQueryOuptut) {}
}
