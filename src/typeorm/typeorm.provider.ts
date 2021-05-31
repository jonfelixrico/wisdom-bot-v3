import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Connection, createConnection, EntityTarget } from 'typeorm'
import { Approval } from './entities/approval.entity'
import { Concur } from './entities/concur.entity'
import { Quote } from './entities/quote.entity'
import { Receive } from './entities/receive.entity'

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
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      }),
    inject: [ConfigService],
  },
  generateEntityProvider('QUOTE_ENTITY', Quote),
  generateEntityProvider('RECEIVE_ENTITY', Receive),
  generateEntityProvider('CONCUR_ENTITY', Concur),
  generateEntityProvider('APPROVAL_ENTITY', Approval),
]