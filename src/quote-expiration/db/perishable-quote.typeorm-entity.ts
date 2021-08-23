import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('perishable-quote')
export class PerishableQuoteTypeormEntity {
  @PrimaryColumn('uuid')
  quoteId: string

  @Column('timestamp with time zone')
  expireDt: Date
}
