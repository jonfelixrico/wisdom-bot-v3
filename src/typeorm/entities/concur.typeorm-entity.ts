import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ReceiveDbEntity } from './receive.typeorm-entity'

@Entity({
  name: 'concur',
})
export class ConcurDbEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  userId: string

  @Column()
  channelId: string

  @Column()
  guildId: string

  @Column({ nullable: true })
  receiveId: string

  @ManyToOne(() => ReceiveDbEntity, (receive) => receive.concurs)
  receive: Promise<ReceiveDbEntity>

  @Column()
  concurDt: Date

  @Column()
  karma: number
}
