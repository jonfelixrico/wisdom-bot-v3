import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MapTypeormEntity } from 'src/typeorm/entities/map.typeorm-entity'
import { Connection, createConnection } from 'typeorm'

export const dbProvider: Provider = {
  provide: Connection,
  useFactory: async (cfg: ConfigService) =>
    await createConnection({
      type: 'postgres',
      url: cfg.get('STATS_DB_URL'),
      synchronize: !!cfg.get('STATS_DB_SYNC'),
      entities: [
        __dirname + '/entities/*.typeorm-entity{.ts,.js}',
        MapTypeormEntity,
      ],
      name: 'stats-model',
    }),
  inject: [ConfigService],
}
