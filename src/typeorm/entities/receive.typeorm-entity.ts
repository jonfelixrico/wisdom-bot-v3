import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { QuoteDbEntity } from './quote.typeorm-entity'
import { ConcurDbEntity } from './concur.typeorm-entity'

@Entity({
  name: 'receive',
})
export class ReceiveDbEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  userId: string

  @Column()
  channelId: string

  @Column()
  guildId: string

  @Column()
  receiveDt: Date

  @Column({ nullable: true })
  quoteId: string

  @ManyToOne(() => QuoteDbEntity, (quote) => quote.receives)
  quote: Promise<QuoteDbEntity>

  @OneToMany(() => ConcurDbEntity, (concur) => concur.receive)
  concurs: Promise<ConcurDbEntity[]>

  @Column()
  messageId: string
}
