import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MapTypeormEntity } from 'src/typeorm/entities/map.typeorm-entity'
import { Connection, createConnection } from 'typeorm'

export const dbProvider: Provider = {
  provide: Connection,
  inject: [ConfigService],
  useFactory: async (cfg: ConfigService): Promise<Connection> =>
    await createConnection({
      type: 'postgres',
      url: cfg.get('READ_DB_URL'),
      synchronize: !!cfg.get('READ_DB_SYNC'),
      entities: [__dirname + '/**/*.typeorm-entity{.ts,.js}', MapTypeormEntity],
      name: 'message-model',
      schema: 'message',
    }),
}
