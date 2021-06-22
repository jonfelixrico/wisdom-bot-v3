import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { EventBus } from '@nestjs/cqrs'
import { ReadEventConsumedEvent } from 'src/read-repositories/read-event-consumed.event'
import { QuoteTypeormRepository } from 'src/typeorm/providers/quote.typeorm-repository'

const BATCH_SIZE = 100

@Injectable()
export class QuoteRevisionTriggerService implements OnApplicationBootstrap {
  constructor(
    private repo: QuoteTypeormRepository,
    private eventBus: EventBus,
    private logger: Logger,
  ) {}

  async emitBatch(offset: number, limit: number): Promise<number> {
    const [rows, count] = await this.repo
      .createQueryBuilder()
      .offset(offset)
      .limit(limit)
      .getManyAndCount()

    for (const { id, esdb } of rows) {
      this.eventBus.publish(
        new ReadEventConsumedEvent(`quote-${id}`, BigInt(esdb.revision)),
      )
    }

    return count
  }

  async onApplicationBootstrap() {
    let offset = 0
    this.logger.verbose(
      'Started emitting revision no. of entities under the quote table.',
      QuoteRevisionTriggerService.name,
    )

    while (true) {
      const emitCount = await this.emitBatch(offset, BATCH_SIZE)
      offset += emitCount

      if (emitCount < BATCH_SIZE) {
        break
      }
    }

    this.logger.verbose(
      `Emitted revision nos. of ${offset} rows.`,
      QuoteRevisionTriggerService.name,
    )
  }
}
