import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('guild-stats')
export class GuildStatsTypeormEntity {
  @PrimaryColumn('varchar')
  guildId: string

  @Column({
    default: 0,
  })
  receives: number

  @Column({
    default: 0,
  })
  submitted: number
}
