import { Injectable } from '@nestjs/common'
import { ReceiveTypeormRepository } from 'src/typeorm/providers/receive.typeorm-repository'

@Injectable()
export class ReceiveQueryService {
  constructor(private repo: ReceiveTypeormRepository) {}

  async getReceiveIdFromMessageId(messageId: string): Promise<string> {
    const receive = await this.repo.findOne({ messageId })

    if (!receive) {
      return null
    }

    return receive.id
  }

  async getReceiveDisplayData(receiveId: string) {
    const receive = await this.repo.findOne({ id: receiveId })

    if (!receive) {
      return null
    }

    const quote = await receive.quote

    const { userId } = receive
    const { content, authorId, submitDt } = quote

    return {
      receive: {
        userId,
      },

      quote: {
        content,
        authorId,
        submitDt,
      },
    }
  }
}
