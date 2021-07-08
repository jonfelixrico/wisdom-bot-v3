import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { QuoteTypeormEntity } from './quote.typeorm-entity'

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
  quote: Promise<QuoteTypeormEntity>

  @Column()
  messageId: string

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
    transformer: {
      to: (val) => val,
      from: (val) => BigInt(val),
    },
  })
  revision: bigint
}
