import { Provider } from '@nestjs/common'
import { PendingQuoteTypeormEntity } from '../entities/pending-quote.typeorm-entity'
import { QuoteTypeormEntity } from '../entities/quote.typeorm-entity'
import { ReceiveTypeormEntity } from '../entities/receive.typeorm-entity'
import { PendingQuoteTypeormRepository } from './pending-quote.typeorm-repository'
import { QuoteTypeormRepository } from './quote.typeorm-repository'
import { ReceiveTypeormRepository } from './receive.typeorm-repository'
import { generateTypeormRepositoryProvider } from './typeorm-provider-factory.util'

export const typeormRepositoryProviders: Provider[] = [
  generateTypeormRepositoryProvider<QuoteTypeormEntity, QuoteTypeormRepository>(
    QuoteTypeormEntity,
    QuoteTypeormRepository,
  ),
  generateTypeormRepositoryProvider(
    PendingQuoteTypeormEntity,
    PendingQuoteTypeormRepository,
  ),
  generateTypeormRepositoryProvider(
    ReceiveTypeormEntity,
    ReceiveTypeormRepository,
  ),
]
