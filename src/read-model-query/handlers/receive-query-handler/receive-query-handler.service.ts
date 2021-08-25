import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { IReceiveQueryOutput, ReceiveQuery } from 'src/queries/receive.query'
import { Connection } from 'typeorm'
import { ReceiveTypeormEntity } from 'src/typeorm/entities/receive.typeorm-entity'
import { omit } from 'lodash'

@QueryHandler(ReceiveQuery)
export class ReceiveQueryHandlerService implements IQueryHandler<ReceiveQuery> {
  constructor(private conn: Connection) {}

  async execute({ input }: ReceiveQuery): Promise<IReceiveQueryOutput> {
    const { receiveId } = input

    const receive = await this.conn
      .getRepository(ReceiveTypeormEntity)
      .findOne({ where: { id: receiveId } })

    if (!receive) {
      return null
    }

    const reactions = await receive.reactions
    // we're removing properties we dont want to expose here
    const omittedReceive = omit(receive, 'quote', 'revision', 'reactions')

    return {
      ...omittedReceive,
      receiveId: receive.id,
      reactions: reactions.map(({ userId, karma }) => {
        return {
          userId,
          karma,
        }
      }),
    }
  }
}
