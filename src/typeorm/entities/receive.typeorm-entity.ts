import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { EsdbEntity } from './esdb-entity.embedded-entity'
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

  @Column(() => EsdbEntity)
  esdb: EsdbEntity

  @Column()
  receiveDt: Date

  @Column()
  userId: string
}
