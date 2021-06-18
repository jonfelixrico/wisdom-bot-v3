import { Injectable } from '@nestjs/common'
import { PendingQuote } from 'src/domain/pending-quote/pending-quote.entity'
import { PendingQuoteRepository } from 'src/domain/pending-quote/pending-quote.repository'
import { ReadStreamService } from 'src/event-store/read-stream/read-stream.service'
import { pendingQuoteReducer } from './pending-quote.reducer'

@Injectable()
export class PendingQuoteWriteRepositoryService extends PendingQuoteRepository {
  constructor(private readStream: ReadStreamService) {
    super()
  }

  async findById(id: string): Promise<PendingQuote> {
    const { state } = await this.readStream.readStreamFromBeginning(
      `quote-${id}`,
      pendingQuoteReducer,
    )

    return new PendingQuote(state)
  }
}
