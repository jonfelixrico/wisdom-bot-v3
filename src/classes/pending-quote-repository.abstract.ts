export interface ISubmittedQuote {
  content: string

  messageId: string

  authorId: string
  submitterId: string

  guildId: string
  channelId: string

  submitDt: Date
  expireDt: Date

  approvalCount: number
  approvalEmoji: string
}

export interface IPendingQuote extends ISubmittedQuote {
  quoteId: string
}

export interface IPendingQuoteOverview {
  [guildId: string]: string[]
}

export abstract class PendingQuoteRepository {
  abstract createPendingQuote(newQuote: ISubmittedQuote): Promise<IPendingQuote>

  abstract getPendingQuoteByChannelId(
    channelId: string,
  ): Promise<IPendingQuote[]>

  abstract getPendingQuote(quoteId: string): Promise<IPendingQuote>

  abstract getPendingQuotesByMessageId(
    messageId: string,
  ): Promise<IPendingQuote>

  abstract approvePendingQuote(
    quoteId: string,
    approveDt?: Date,
  ): Promise<boolean>

  abstract getPendingQuoteOverview(): Promise<IPendingQuoteOverview>

  abstract updateMessageId(quoteId: string, messageId: string): Promise<boolean>
}
