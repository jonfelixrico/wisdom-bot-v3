import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({
  name: 'reaction',
})
export class ReactionTypeormEntity {
  @PrimaryColumn('uuid')
  id: string

  @Column({
    nullable: true,
  })
  receiveId: string

  @Column()
  reactionDt: Date

  @Column()
  userId: string

  @Column({ type: 'integer' })
  karma: number
}
