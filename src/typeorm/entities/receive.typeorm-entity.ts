import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm'
import { QuoteTypeormEntity } from './quote.typeorm-entity'
import { ReactionTypeormEntity } from './reaction.typeorm-entity'

@Entity({
  name: 'receive',
})
export class ReceiveTypeormEntity {
  @PrimaryColumn('uuid')
  id: string

  @Column({
    nullable: true,
  })
  quoteId: string

  @ManyToOne(() => QuoteTypeormEntity, {
    nullable: true,
  })
  @JoinColumn({
    name: 'quoteId',
    referencedColumnName: 'id',
  })
  quote: Promise<QuoteTypeormEntity>

  @Column({
    nullable: true,
  })
  messageId: string

  @Column({
    nullable: true,
  })
  interactionToken: string

  @Column()
  guildId: string

  @Column()
  channelId: string

  @Column()
  receiveDt: Date

  @Column()
  userId: string

  @Column({
    type: 'bigint',
    // without this, we need to make sure to cast `revision` as BigInt every time we need to use it
    transformer: {
      to: (val) => val,
      from: (val) => BigInt(val),
    },
  })
  revision: bigint

  @Column({
    default: 0,
  })
  receiveCountSnapshot: number

  @OneToMany(() => ReactionTypeormEntity, (reaction) => reaction.receive)
  reactions: Promise<Array<ReactionTypeormEntity>>
}
