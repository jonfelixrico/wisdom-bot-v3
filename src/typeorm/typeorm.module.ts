import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Connection, createConnection } from 'typeorm'
import { typeormRepositoryProviders } from './providers/repository-providers.provider'

const typeormConnectionProvider = {
  provide: Connection,
  useFactory: async (cfg: ConfigService) =>
    await createConnection({
      type: 'mysql',
      url: cfg.get('READ_DB_URL'),
      synchronize: !!cfg.get('READ_DB_SYNC'),
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
