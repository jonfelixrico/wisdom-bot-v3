import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({
  name: 'quote',
})
export class QuoteTypeormEntity {
  @PrimaryColumn('uuid')
  id: string

  @Column()
  guildId: string

  @Column()
  submitterId: string

  @Column()
  authorId: string

  @Column()
  content: string

  // mostly for pending quotes

  @Column({
    nullable: true,
  })
  messageId: string

  @Column({
    nullable: true,
  })
  channelId: string

  @Column({
    type: 'int',
    nullable: true,
  })
  upvoteCount: number

  @Column({
    nullable: true,
  })
  upvoteEmoji: string

  @Column({
    nullable: true,
  })
  expireDt: Date

  @Column({
    type: 'bigint',
    // without this, we need to make sure to cast `revision` as BigInt every time we need to use it
    transformer: {
      to: (val) => val,
      from: (val) => BigInt(val),
    },
  })
  revision: bigint

  @Column({ nullable: true })
  acceptDt: Date

  @Column({ nullable: true })
  cancelDt: Date

  @Column()
  submitDt: Date
}
