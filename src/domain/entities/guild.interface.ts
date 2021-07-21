export interface IQuoteSettings {
  upvoteCount: string
  upvoteEmoji: string
}

export interface ISettings {
  // hex string
  embedColor: string
}

export interface IGuildEntity {
  guildId: string
  settings: ISettings
  quoteSettings: IQuoteSettings
}
