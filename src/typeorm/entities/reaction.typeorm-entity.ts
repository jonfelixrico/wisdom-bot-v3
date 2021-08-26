import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { ReceiveTypeormEntity } from './receive.typeorm-entity'

@Entity({
  name: 'reaction',
})
export class ReactionTypeormEntity {
  @PrimaryColumn('varchar')
  id: string

  @Column({
    nullable: true,
  })
  receiveId: string

  @ManyToOne(() => ReceiveTypeormEntity, {
    nullable: true,
  })
  @JoinColumn({
    name: 'receiveId',
    referencedColumnName: 'id',
  })
  receive: Promise<ReceiveTypeormEntity>

  @Column()
  reactionDt: Date

  @Column()
  userId: string

  @Column({ type: 'integer' })
  karma: number
}
