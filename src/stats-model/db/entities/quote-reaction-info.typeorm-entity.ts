import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('quote-reaction-info')
export class QuoteReactionInfoTypeormEntity {
  @PrimaryColumn('varchar')
  id: string

  @Column('varchar')
  quoteId: string

  @Column()
  karma: number
}
