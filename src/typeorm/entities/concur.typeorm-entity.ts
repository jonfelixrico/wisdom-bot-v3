import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Receive } from './receive.typeorm-entity'

@Entity()
export class Concur {
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

  @ManyToOne(() => Receive, (receive) => receive.concurs)
  receive: Promise<Receive>

  @Column()
  concurDt: Date
}
