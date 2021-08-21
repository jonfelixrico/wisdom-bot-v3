import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('guild-stats')
export class GuildStatsTypeormEntity {
  @PrimaryColumn('varchar')
  guildId: string

  @Column({
    type: 'long',
    default: 0,
  })
  recieves: number

  @Column({
    type: 'long',
    default: 0,
  })
  submitted: number
}
