import { ConfigService } from '@nestjs/config'
import { createConnection } from 'typeorm'

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
]
