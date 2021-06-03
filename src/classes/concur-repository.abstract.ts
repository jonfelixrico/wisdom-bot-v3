export interface INewConcur {
  receiveId: string
  userId: string
  channelId: string
  guildId: string
}

export interface IConcur extends INewConcur {
  concurId: string
  concurDt: Date
}

export abstract class ConcurRepository {
  abstract createConcur(newConcur: INewConcur): Promise<[IConcur, number]>

  abstract findConcursByReceiveId(receiveId: string): Promise<IConcur[]>
}
