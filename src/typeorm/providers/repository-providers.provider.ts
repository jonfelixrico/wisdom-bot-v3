import { Provider } from '@nestjs/common'
import { QuoteTypeormEntity } from '../entities/quote.typeorm-entity'
import { ReceiveTypeormEntity } from '../entities/receive.typeorm-entity'
import { QuoteTypeormRepository } from './quote.typeorm-repository'
import { ReceiveTypeormRepository } from './receive.typeorm-repository'
import { generateTypeormRepositoryProvider } from './typeorm-provider-factory.util'
import { InteractionTypeormEntity } from './../entities/interaction.typeorm-entity'
import { InteractionTypeormRepository } from './interaction.typeorm-repository'

export const typeormRepositoryProviders: Provider[] = [
  generateTypeormRepositoryProvider<QuoteTypeormEntity, QuoteTypeormRepository>(
    QuoteTypeormEntity,
    QuoteTypeormRepository,
  ),

  generateTypeormRepositoryProvider(
    ReceiveTypeormEntity,
    ReceiveTypeormRepository,
  ),

  generateTypeormRepositoryProvider(
    InteractionTypeormEntity,
    InteractionTypeormRepository,
  ),
]
