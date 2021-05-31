import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Receive } from './receive.entity'
import { Approval } from './approver.entity'

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

  // -- end of essential quote properties --

  // -- start of pending quote properties --

  @OneToMany(() => Approval, (approval) => approval.quote)
  approvals: Promise<Approval[]>

  @Column({ nullable: true })
  expireDt: Date

  @Column({ nullable: true })
  requiredApprovalCount: number

  @Column({ nullable: true })
  approveDt: Date
}
