import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { ReceiveTypeormEntity } from './receive.typeorm-entity'

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

  @ManyToOne(() => ReceiveTypeormEntity, {
    nullable: true,
  })
  receive: Promise<ReceiveTypeormEntity>

  @Column()
  reactionDt: Date

  @Column()
  userId: string

  @Column({ type: 'integer' })
  karma: number

  // This is here to boost the performance of retrieving reactions from a certain guild
  @Column()
  guildId: string
}
