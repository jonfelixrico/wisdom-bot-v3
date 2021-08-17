import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({
  name: 'pending-quotes-tracker',
})
export class GuildChannelPendingQuoteTrackerTypeormEntity {
  @PrimaryColumn('varchar')
  id: string

  @Column('varchar')
  guildId: string

  @Column('varchar')
  channelId: string

  @Column({
    default: 0,
  })
  count: number
}
