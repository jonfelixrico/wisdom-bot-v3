import { Injectable } from '@nestjs/common'
import { QuoteTypeormEntity } from 'src/typeorm/entities/quote.typeorm-entity'
import { Connection } from 'typeorm'

@Injectable()
export class QuoteQueryService {
  constructor(private conn: Connection) {}

  private get manager() {
    return this.conn.manager
  }

  /**
   * Finds the id of the quote assocaited with the `messageId`
   * @param messageId
   * @returns Null if no associated quote was found; the id of the quote if otherwise.
   */
  async getQuoteIdFromMessageId(messageId: string) {
    const matchingQuote = await this.manager.findOne(QuoteTypeormEntity, {
      messageId,
    })

    if (!matchingQuote) {
      return null
    }

    return matchingQuote.id
  }
}
