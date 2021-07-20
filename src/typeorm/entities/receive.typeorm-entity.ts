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
    // without this, we need to make sure to cast `revision` as BigInt every time we need to use it
    transformer: {
      to: (val) => val,
      from: (val) => BigInt(val),
    },
  })
  revision: bigint

  // This is here to avoid joining tables when retrieving the total number of retrieves of an author
  @Column()
  parentQuoteAuthorId: string
}
