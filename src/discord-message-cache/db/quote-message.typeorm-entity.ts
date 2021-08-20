import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('quote-message')
export class QuoteMessageTypeormEntity {
  @PrimaryColumn('uuid')
  quoteId: string

  @Column('varchar')
  messageId: string

  @Column('varchar')
  channelId: string

  @Column('varchar')
  guildId: string
}
