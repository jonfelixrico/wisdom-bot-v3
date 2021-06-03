export interface IQuoteStats {
  quotes: number
  receives: number
  concurs: number
}

export abstract class StatsRepository {
  abstract getSubmittedQuoteStats(userId: string): Promise<IQuoteStats>

  abstract getAuthoredQuoteStats(userId: string): Promise<IQuoteStats>
}
