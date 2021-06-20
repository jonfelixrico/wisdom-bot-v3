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

  @Column({
    type: 'int',
  })
  upvoteCount: number

  @Column()
  upvoteEmoji: string

  @Column()
  expireDt: string

  @Column()
  submitterId: string

  @Column()
  authorId: string

  @Column(() => EsdbEntity)
  esdb: EsdbEntity
}
