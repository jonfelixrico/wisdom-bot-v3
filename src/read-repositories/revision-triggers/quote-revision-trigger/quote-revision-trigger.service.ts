import { Injectable, Logger } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { QuoteTypeormRepository } from 'src/typeorm/providers/quote.typeorm-repository'
import { GetEventQuery } from 'src/read-model-builder-services/classes/get-event.query'
import { OnModuleInit } from '@nestjs/common'

const BATCH_SIZE = 100

@Injectable()
export class QuoteRevisionTriggerService implements OnModuleInit {
  constructor(
    private repo: QuoteTypeormRepository,
    private queryBus: QueryBus,
    private logger: Logger,
  ) {}

  private async emitBatch(offset: number, limit: number): Promise<number> {
    const [rows, count] = await this.repo
      .createQueryBuilder()
      .offset(offset)
      .limit(limit)
      .getManyAndCount()

    for (const { id, esdb } of rows) {
      this.queryBus.execute(
        new GetEventQuery(`quote-${id}`, BigInt(esdb.revision) + 1n),
      )
    }

    return count
  }

  async onModuleInit() {
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
