import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('guild-member')
export class GuildMemeberTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  userId: string

  @Column('varchar')
  guildId: string

  @Column({
    default: 0,
  })
  receives: number

  @Column({
    default: 0,
  })
  submissions: number
}
