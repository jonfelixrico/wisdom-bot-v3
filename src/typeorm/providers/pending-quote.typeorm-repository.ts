import { Repository } from 'typeorm'
import { PendingQuoteTypeormEntity } from '../entities/pending-quote.typeorm-entity'

export class PendingQuoteTypeormRepository extends Repository<PendingQuoteTypeormEntity> {}
