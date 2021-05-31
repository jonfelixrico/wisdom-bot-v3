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
}

export interface IPendingQuote extends INewQuote {
  quoteId: string
  expireDt: Date
  approveDt?: Date
  approvers: {
    userId: string
    approveDt: Date
  }[]
  requiredApprovalCount: number
}

export abstract class QuoteRepository {
  abstract getQuote(quoteId: string): Promise<IQuote>

  abstract getRandomQuote(guildId: string): Promise<IQuote>

  abstract createQuote(newQuote: INewQuote): Promise<IPendingQuote>

  abstract getPendingQuotes(guildId: string): Promise<IPendingQuote[]>

  abstract getPendingQuote(quoteId: string): Promise<IPendingQuote>

  abstract addApprover(quoteId: string, userId: string): Promise<IPendingQuote>
}
