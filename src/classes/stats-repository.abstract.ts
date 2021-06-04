export interface IQuoteStats {
  quotes: number
  receives: number
  concurs: number
}

export abstract class StatsRepository {
  abstract getSubmittedQuoteStats(
    userId: string,
    guildId: string,
  ): Promise<IQuoteStats>

  abstract getPersonalQuoteStats(
    userId: string,
    guildId: string,
  ): Promise<IQuoteStats>
}
