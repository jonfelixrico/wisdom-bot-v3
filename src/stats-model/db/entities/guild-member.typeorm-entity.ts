import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('guild-member')
export class GuildMemberTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  userId: string

  @Column('varchar')
  guildId: string

  @Column({
    default: 0,
    comment: 'Number of times this user has used the receive command.',
  })
  receives: number

  @Column({
    default: 0,
    comment: 'Number of times other users has received quotes from this user',
  })
  quoteReceives: number

  @Column({
    default: 0,
  })
  submissions: number

  @Column({
    default: 0,
  })
  reactions: number
}
