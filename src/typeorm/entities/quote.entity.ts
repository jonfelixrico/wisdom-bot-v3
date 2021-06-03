import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
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

  @Column()
  expireDt: Date

  @Column()
  approveDt: Date

  @OneToMany(() => Receive, (receive) => receive.quote)
  receives: Promise<Receive[]>

  @Column()
  approvalEmoji: string

  @Column()
  approvalCount: number
}
