export interface IQuoteSettings {
  upvoteCount: number
  upvoteEmoji: string
  // time millis; determines how long to wait until a quote is marked as expired
  upvoteWindow: number
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
