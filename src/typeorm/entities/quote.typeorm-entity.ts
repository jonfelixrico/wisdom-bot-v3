import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ReceiveDbEntity } from './receive.typeorm-entity'

@Entity({
  name: 'quote',
})
export class QuoteDbEntity {
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

  @OneToMany(() => ReceiveDbEntity, (receive) => receive.quote)
  receives: Promise<ReceiveDbEntity[]>

  @Column({ nullable: true })
  approvalEmoji: string

  @Column({ nullable: true })
  approvalCount: number
}
