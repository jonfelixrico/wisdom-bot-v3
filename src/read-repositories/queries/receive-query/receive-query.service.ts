import { Injectable } from '@nestjs/common'
import { ReceiveTypeormEntity } from 'src/typeorm/entities/receive.typeorm-entity'
import { Connection } from 'typeorm'

@Injectable()
export class ReceiveQueryService {
  constructor(private conn: Connection) {}

  private get repository() {
    return this.conn.getRepository(ReceiveTypeormEntity)
  }

  async getReceiveIdFromMessageId(messageId: string): Promise<string> {
    const { repository } = this

    const receive = await repository.findOne({ messageId })

    if (!receive) {
      return null
    }

    return receive.id
  }
}
