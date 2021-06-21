import { Column, Entity, PrimaryColumn } from 'typeorm'
import { EsdbEntity } from './esdb-entity.embedded-entity'

@Entity({
  name: 'quote',
})
export class QuoteTypeormEntity {
  @PrimaryColumn('uuid')
  id: string

  @Column()
  guildId: string

  @Column()
  submitterId: string

  @Column()
  authorId: string

  @Column()
  content: string

  // mostly for pending quotes

  @Column({
    nullable: true,
  })
  messageId: string

  @Column({
    nullable: true,
  })
  channelId: string

  @Column({
    type: 'int',
    nullable: true,
  })
  upvoteCount: number

  @Column({
    nullable: true,
  })
  upvoteEmoji: string

  @Column({
    nullable: true,
  })
  expireDt: string

  @Column(() => EsdbEntity)
  esdb: EsdbEntity
}
