import { Column, Entity, PrimaryColumn } from 'typeorm'

/**
 * Contains bare quote information necessary for stats:
 * authorId, quoteId, and content
 */
@Entity('quote-info')
export class QuoteInfoTypeormEntity {
  @PrimaryColumn('varchar')
  quoteId: string

  @Column('varchar')
  authorId: string

  @Column()
  content: string

  @Column()
  guildId: string

  @Column({
    default: 0,
  })
  receives: number
}
