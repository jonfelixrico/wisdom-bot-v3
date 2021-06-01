import { Inject, Injectable } from '@nestjs/common'
import {
  ConcurRepository,
  IConcur,
  INewConcur,
} from 'src/classes/concur-repository.abstract'
import { Concur } from 'src/typeorm/entities/concur.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ConcurRepoImplService extends ConcurRepository {
  constructor(
    @Inject('CONCUR_ENTITY')
    private concurRepo: Repository<Concur>,
  ) {
    super()
  }

  private getConcurCount(receiveId: string) {
    return this.concurRepo
      .createQueryBuilder()
      .where('receiveId = :receiveId', { receiveId })
      .getCount()
  }

  async createConcur({
    channelId,
    guildId,
    receiveId,
    userId,
  }: INewConcur): Promise<[IConcur, number]> {
    const { id: concurId, concurDt } = await this.concurRepo.save({
      receiveId,
      channelId,
      guildId,
      userId,
      concurDt: new Date(),
    })

    return [
      {
        channelId,
        guildId,
        receiveId,
        userId,
        concurDt,
        concurId,
      },
      await this.getConcurCount(receiveId),
    ]
  }
}
