import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { ReceiveTypeormEntity } from './receive.typeorm-entity'

@Entity({
  name: 'interaction',
})
export class InteractionTypeormEntity {
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
  interactionDt: Date

  @Column()
  userId: string

  @Column({ type: 'integer' })
  karma: number
}
