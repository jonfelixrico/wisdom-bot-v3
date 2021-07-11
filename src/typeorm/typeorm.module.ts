import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Connection, createConnection } from 'typeorm'
import { typeormRepositoryProviders } from './providers/repository-providers.provider'

const typeormConnectionProvider = {
  provide: Connection,
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
}

const typeormProviders = [
  typeormConnectionProvider,
  ...typeormRepositoryProviders,
]

@Module({
  providers: typeormProviders,
  exports: typeormProviders,
})
export class TypeormModule {}
