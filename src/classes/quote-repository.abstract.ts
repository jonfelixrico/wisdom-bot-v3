export enum QuoteStatus {
  ACCEPTED,
  EXPIRED,
  PENDING,
}

export interface INewQuote {
  content: string

  // for tracking
  messageId: string

  authorId: string
  submitterId: string

  guildId: string
  channelId: string

  submitDt: Date
}

export interface IQuote extends INewQuote {
  quoteId: string

  acceptDt?: Date
  expireDt?: Date

  status: QuoteStatus
}

export abstract class QuoteRepository {
  abstract createQuote(newQuote: INewQuote): Promise<IQuote>

  abstract getQuote(quoteId: string): Promise<IQuote>

  abstract getRandomQuote(guildId: string): Promise<IQuote>

  abstract approveQuote(quoteId: string): Promise<IQuote>
}
