export interface IGuildSettings {
  expireMillis: number
  approveEmoji: string
  approveCount: number
}

export abstract class GuildRepository {
  abstract getQuoteSettings(guildId: string): Promise<IGuildSettings>
}
