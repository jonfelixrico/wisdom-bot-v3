import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Connection, createConnection } from 'typeorm'

export const dbProvider: Provider = {
  provide: Connection,
  inject: [ConfigService],
  useFactory: async (cfg: ConfigService) => {
    await createConnection({
      type: 'postgres',
      url: cfg.get('READ_DB_URL'),
      synchronize: !!cfg.get('READ_DB_SYNC'),
      entities: [__dirname + '/**/*.typeorm-entity{.ts,.js}'],
      name: 'expiration-model',
      schema: 'expiration',
    })
  },
}
