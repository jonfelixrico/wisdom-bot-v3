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

  @Column()
  expireDt: Date

  @Column()
  messageId: string

  @Column({ nullable: true })
  quoteId: string

  @OneToOne(() => Quote)
  @JoinColumn()
  quote: Promise<Quote>
}
