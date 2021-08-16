import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({
  name: 'quote-vote',
})
export class QuoteVoteTypeormEntity {
  @PrimaryColumn('varchar')
  id: string

  @Column()
  userId: string

  @Column()
  value: number

  @Column()
  quoteId: string
}
