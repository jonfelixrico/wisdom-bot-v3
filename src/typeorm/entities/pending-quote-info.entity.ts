import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Quote } from './quote.entity'

@Entity()
export class PendingQuoteInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  emoji: string

  @Column()
  requiredCount: number

  @Column()
  expireDt: Date

  @Column()
  messageId: string

  @Column()
  approveDt: string

  @OneToOne(() => Quote, (q) => q.pendingInfo)
  quote: Promise<Quote>
}
