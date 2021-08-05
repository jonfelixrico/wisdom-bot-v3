import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

/**
 * Keeps track the number of actions a user has done to another user, scoped per guild.
 * This is for stat-tracking so that we won't need to rely on joins and aggregates to crunch the numbers.
 */
@Entity('guild-member-interaction')
export class GuildMemberInteractionTypeormEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  userId: string

  @Column()
  targetUserId: string

  @Column()
  guildId: string

  @Column({
    default: 0,
    comment: 'Times user has submitted a quote authored by targetUser',
  })
  submitted: number

  @Column({
    default: 0,
    comment: 'Times user has received a quote belonging to targetUser',
  })
  receives: number

  @Column({
    default: 0,
    comment: 'Times user has reacted to a quote authored by targetUser',
  })
  authorReacts: number

  @Column({
    default: 0,
    comment: 'Times user has reacted to a quote received by targetUser',
  })
  receiveReacts: number
}
