import { Repository } from 'typeorm'
import { QuoteTypeormEntity } from '../entities/quote.typeorm-entity'

export class QuoteTypeormRepository extends Repository<QuoteTypeormEntity> {}
