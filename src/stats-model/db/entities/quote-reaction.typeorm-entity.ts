import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('quote-reaction')
export class QuoteReactionTypeormEntity {
  @PrimaryColumn('varchar')
  id: string

  @Column('varchar')
  quoteId: string

  @Column()
  karma: number
}
