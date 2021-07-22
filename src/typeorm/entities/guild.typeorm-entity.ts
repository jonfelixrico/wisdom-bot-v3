import { IQuoteSettings, ISettings } from 'src/domain/entities/guild.interfaces'
import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({
  name: 'guild',
})
export class GuildTypeormEntity {
  @PrimaryColumn('uuid')
  id: string

  @Column()
  guildId: string

  @Column('json')
  quoteSettings: IQuoteSettings

  @Column('json')
  settings: ISettings

  @Column({
    type: 'bigint',
    // without this, we need to make sure to cast `revision` as BigInt every time we need to use it
    transformer: {
      to: (val) => val,
      from: (val) => BigInt(val),
    },
  })
  revision: bigint
}
