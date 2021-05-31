import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Quote } from './quote.entity'

@Entity()
export class Approval {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Quote, (quote) => quote.approvals)
  quote: Promise<Quote>

  @Column()
  userId: string
}
