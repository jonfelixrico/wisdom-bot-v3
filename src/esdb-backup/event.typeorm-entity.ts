import { Column, Entity, Generated, PrimaryColumn } from 'typeorm'

@Entity({ name: 'event' })
export class EventTypeormEntity {
  @Generated('increment')
  @PrimaryColumn({
    type: 'bigint',
    transformer: {
      to: (val) => val,
      from: (val) => BigInt(val),
    },
  })
  rowNo: bigint

  @Column('json')
  data: string

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

  @Column('uuid')
  eventId: string

  @Column('varchar')
  stream: string

  @Column()
  timestamp: Date
}
