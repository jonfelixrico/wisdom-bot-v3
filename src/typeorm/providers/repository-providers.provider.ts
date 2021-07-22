import { Provider } from '@nestjs/common'
import { QuoteTypeormEntity } from '../entities/quote.typeorm-entity'
import { ReceiveTypeormEntity } from '../entities/receive.typeorm-entity'
import { QuoteTypeormRepository } from './quote.typeorm-repository'
import { ReceiveTypeormRepository } from './receive.typeorm-repository'
import { ReactionTypeormEntity } from '../entities/reaction.typeorm-entity'
import { ReactionTypeormRepository } from './reaction.typeorm-repository'
import { Connection, Repository } from 'typeorm'
import { GuildTypeormEntity } from '../entities/guild.typeorm-entity'
import { GuildTypeormRepository } from './guild.typeorm-repository'

type EntityPair<Entity> = [new () => Entity, new () => Repository<Entity>]

const entityPairs: EntityPair<unknown>[] = [
  [QuoteTypeormEntity, QuoteTypeormRepository],
  [ReceiveTypeormEntity, ReceiveTypeormRepository],
  [ReactionTypeormEntity, ReactionTypeormRepository],
  [GuildTypeormEntity, GuildTypeormRepository],
]

export const typeormRepositoryProviders: Provider[] = entityPairs.map(
  ([entity, repo]) => {
    return {
      useFactory: (conn: Connection) => conn.getRepository(entity),
      provide: repo,
      inject: [Connection],
    }
  },
)
