import { Column, Entity, PrimaryColumn } from 'typeorm'
import { EsdbEntity } from './esdb-entity.embedded-entity'

@Entity({
  name: 'pending-quote',
})
export class PendingQuoteTypeormEntity {
  @PrimaryColumn('uuid')
  id: string

  @Column()
  messageId: string

  @Column()
  channelId: string

  @Column()
  guildId: string

  @Column({
    type: 'int',
  })
  upvoteCount: number

  @Column()
  upvoteEmoji: string

  @Column()
  expireDt: string

  @Column(() => EsdbEntity)
  esdb: EsdbEntity
}
