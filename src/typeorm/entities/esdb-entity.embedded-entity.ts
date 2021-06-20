import { Column } from 'typeorm'

export abstract class EsdbEntity {
  @Column({
    type: 'bigint',
  })
  revision: bigint
}
