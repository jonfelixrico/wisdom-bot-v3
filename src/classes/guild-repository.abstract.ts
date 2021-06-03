export interface IGuildSettings {
  expireMillis: number
  approveEmoji: string
}

export abstract class GuildRepository {
  abstract getQuoteSettings(guildId: string): Promise<IGuildSettings>
}
