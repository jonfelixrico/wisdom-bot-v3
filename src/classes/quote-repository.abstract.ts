export interface INewQuote {
  content: string

  // for tracking
  messageId: string

  authorId: string
  submitterId: string

  guildId: string
  channelId: string

  submitDt?: Date

  // TODO separate INewQuote with expireDt
  expireDt?: Date
}

export interface IQuote extends INewQuote {
  submitDt: Date
  quoteId: string
}

export interface IPendingQuote extends IQuote {
  expireDt: Date
  approveDt?: Date
  approvers: {
    userId: string
    approveDt: Date
  }[]
  requiredApprovalCount: number
}

export interface IGuildsAndChannelsWithPendingQuotes {
  [guildId: string]: string[]
}

export abstract class QuoteRepository {
  abstract getQuote(quoteId: string): Promise<IQuote>

  abstract getRandomQuote(guildId: string, authorId?: string): Promise<IQuote>

  abstract createQuote(newQuote: INewQuote): Promise<IPendingQuote>

  abstract getChannelPendingQuotes(channelId: string): Promise<IPendingQuote[]>

  abstract getPendingQuote(quoteId: string): Promise<IPendingQuote>

  abstract getPendingQuoteByMessageId(messageId: string): Promise<IPendingQuote>

  abstract addApprover(quoteId: string, userId: string): Promise<IPendingQuote>

  abstract setApproveDt(quoteId: string, approveDt?: Date): Promise<boolean>

  abstract getIdsOfGuildsAndChannelsWithPendingQuotes(): Promise<IGuildsAndChannelsWithPendingQuotes>

  abstract setMessageId(quoteId: string, messageId: string): Promise<boolean>
}
