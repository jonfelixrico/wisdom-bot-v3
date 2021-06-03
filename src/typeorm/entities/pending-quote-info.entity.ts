import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Quote } from './quote.entity'

@Entity()
export class PendingQuoteInfo {
  @PrimaryGeneratedColumn('uuid')
  pendingQuoteId: string

  @Column()
  emoji: string

  @Column()
  requiredCount: number

  @Column({ nullable: true })
  quoteId: string

  @Column()
  expireDt: Date

  @OneToOne(() => Quote)
  @JoinColumn()
  quote: Promise<Quote>
}
