import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'quote-vote',
})
export class QuoteVoteTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  userId: string

  @Column()
  value: number

  @Column()
  quoteId: string
}
