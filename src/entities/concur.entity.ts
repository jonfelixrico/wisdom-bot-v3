import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Receive } from './receive.entity'

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

  @ManyToOne(() => Receive, (receive) => receive.concurs)
  receive: Promise<Receive>

  @Column()
  concurDt: Date
}
