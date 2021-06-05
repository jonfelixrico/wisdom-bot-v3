import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Connection, createConnection, EntityTarget } from 'typeorm'
import { ConcurDbEntity } from './entities/concur.typeorm-entity'
import { QuoteDbEntity } from './entities/quote.typeorm-entity'
import { ReceiveDbEntity } from './entities/receive.typeorm-entity'

function generateEntityProvider(
  providerName: string,
  entityClass: EntityTarget<unknown>,
): Provider {
  return {
    provide: providerName,
    useFactory: (conn: Connection) => conn.getRepository(entityClass),
    inject: ['CONNECTION'],
  }
}

export const typeormProviders = [
  {
    provide: 'CONNECTION',
    useFactory: async (cfg: ConfigService) =>
      await createConnection({
        type: 'mysql',
        host: cfg.get('DB_HOST'),
        port: cfg.get('DB_PORT'),
        database: cfg.get('DB_DATABASE'),
        username: cfg.get('DB_USERNAME'),
        password: cfg.get('DB_PASSWORD'),
        synchronize: !!cfg.get('DB_SYNC'),
        entities: [__dirname + '/../**/*.typeorm-entity{.ts,.js}'],
      }),
    inject: [ConfigService],
  },

  generateEntityProvider('QUOTE_ENTITY', QuoteDbEntity),
  generateEntityProvider('RECEIVE_ENTITY', ReceiveDbEntity),
  generateEntityProvider('CONCUR_ENTITY', ConcurDbEntity),
]
