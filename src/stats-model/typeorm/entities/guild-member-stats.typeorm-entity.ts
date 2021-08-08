import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

/**
 * Each row in this table contains trackers for different actions per user, per guild.
 * Even though we have GuildMemberInteractionTypeormEntity, we're adding this one to minimize the use of aggregation.
 *
 * This table is experimental and may be removed in the future.
 */
@Entity('guild-member-stats')
export class GuildMemberInteractionTypeormEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  userId: string

  @Column()
  guildId: string

  @Column({
    default: 0,
    comment: 'No. of quotes submitted',
  })
  submitted: number

  @Column({
    default: 0,
    comment: 'No. of quotes authored',
  })
  authored: number

  @Column({
    default: 0,
    comment: 'No. of quotes received',
  })
  recieved: number

  @Column({
    default: 0,
    comment: 'Times a quote authored by this user got received',
  })
  quoteReceives: number
}
