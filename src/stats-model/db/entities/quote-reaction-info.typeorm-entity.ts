import { Column, Entity, PrimaryColumn } from 'typeorm'

/**
 * We're using this entity to keep track of which reactions belong to which quotes.
 */
@Entity('quote-reaction-info')
export class QuoteReactionInfoTypeormEntity {
  @PrimaryColumn('varchar')
  id: string

  @Column('varchar')
  quoteId: string

  @Column()
  karma: number
}
