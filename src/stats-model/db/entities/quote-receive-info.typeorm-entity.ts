import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { QuoteInfoTypeormEntity } from './quote-info.typeorm-entity'

@Entity('quote-receive-info')
export class QuoteReceiveInfoTypeormEntity {
  @PrimaryColumn('uuid')
  receiveId: string

  @Column('uuid')
  quoteId: string

  @ManyToOne(() => QuoteInfoTypeormEntity)
  @JoinColumn({
    name: 'quoteId',
    referencedColumnName: 'quoteId',
  })
  quote: Promise<QuoteInfoTypeormEntity>
}
