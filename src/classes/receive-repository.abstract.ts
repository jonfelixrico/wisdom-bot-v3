export interface INewReceive {
  quoteId: string
  userId: string
  channelId: string
  guildId: string
  messageId: string
  receiveDt?: Date
}

export interface IReceive extends INewReceive {
  receiveId: string
  receiveDt: Date
}

export abstract class ReceiveRepository {
  abstract createRecieve(receive: INewReceive): Promise<[IReceive, number]>
}
