import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { PendingQuoteInfo } from './pending-quote-info.entity'
import { Receive } from './receive.entity'

@Entity()
export class Quote {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  content: string

  @Column()
  messageId: string

  @Column()
  authorId: string

  @Column()
  submitterId: string

  @Column()
  guildId: string

  @Column()
  channelId: string

  @Column()
  submitDt: Date

  @OneToMany(() => Receive, (receive) => receive.quote)
  receives: Promise<Receive[]>

  @OneToOne(() => PendingQuoteInfo, (p) => p.quote)
  pendingInfo: Promise<PendingQuoteInfo>
}
