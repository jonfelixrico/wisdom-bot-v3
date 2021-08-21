import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('quote-message')
export class QuoteMessageTypeormEntity {
  @PrimaryColumn('uuid')
  quoteId: string

  // These two columns are made nullable because some legacy events have them as null

  @Column({
    type: 'varchar',
    nullable: true,
  })
  messageId: string

  @Column({
    type: 'varchar',
    nullable: true,
  })
  channelId: string

  @Column('varchar')
  guildId: string
}
