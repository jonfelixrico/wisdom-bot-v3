import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({
  name: 'map',
})
/**
 * This is basically just a persistent JS map but both key and value are strings.
 */
export class MapTypeormEntity {
  @PrimaryColumn('varchar')
  key: string

  @Column()
  value: string
}
