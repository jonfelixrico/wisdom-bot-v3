import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('perishable-quote')
export class PerishableQuoteTypeormEntity {
  @PrimaryColumn('uuid')
  quoteId: string

  @Column({
    type: 'timestamp with time zone',
    nullable: true,
  })
  expireDt: Date
}
