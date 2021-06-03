import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Receive } from './receive.entity'

@Entity()
export class Quote {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  content: string

  @Column({ nullable: true })
  messageId: string

  @Column()
  authorId: string

  @Column()
  submitterId: string

  @Column()
  guildId: string

  @Column({ nullable: true })
  channelId: string

  @Column()
  submitDt: Date

  @Column({ nullable: true })
  expireDt: Date

  @Column({ nullable: true })
  approveDt: Date

  @OneToMany(() => Receive, (receive) => receive.quote)
  receives: Promise<Receive[]>

  @Column({ nullable: true })
  approvalEmoji: string

  @Column({ nullable: true })
  approvalCount: number
}
