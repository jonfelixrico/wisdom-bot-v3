import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Quote } from './quote.typeorm-entity'
import { Concur } from './concur.typeorm-entity'

@Entity()
export class Receive {
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

  @ManyToOne(() => Quote, (quote) => quote.receives)
  quote: Promise<Quote>

  @OneToMany(() => Concur, (concur) => concur.receive)
  concurs: Promise<Concur[]>

  @Column()
  messageId: string
}
