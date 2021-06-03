export interface IQuote {
  content: string

  // for tracking
  messageId: string

  authorId: string
  submitterId: string

  guildId: string
  channelId: string

  submitDt: Date
  quoteId: string
}

export abstract class QuoteRepository {
  abstract getQuote(quoteId: string): Promise<IQuote>

  abstract getRandomQuote(guildId: string, authorId?: string): Promise<IQuote>
}
