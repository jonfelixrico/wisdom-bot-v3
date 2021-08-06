import { JSONType } from '@eventstore/db-client'
import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'event' })
export class EventTypeormEntity {
  @PrimaryColumn('uuid')
  eventId: string

  @Column('json')
  data: JSONType

  @Column()
  type: string

  @Column({
    type: 'bigint',
    transformer: {
      to: (val) => val,
      from: (val) => BigInt(val),
    },
  })
  commit: bigint

  @Column({
    type: 'bigint',
    transformer: {
      to: (val) => val,
      from: (val) => BigInt(val),
    },
  })
  prepare: bigint

  @Column('varchar')
  streamId: string

  @Column({
    type: 'bigint',
    transformer: {
      to: (val) => val,
      from: (val) => BigInt(val),
    },
  })
  commitPosition: bigint
}
