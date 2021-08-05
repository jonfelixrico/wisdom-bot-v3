import { Module } from '@nestjs/common'
import { Connection, createConnection } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { EventTypeormEntity } from './event.typeorm-entity'

@Module({
  providers: [
    {
      provide: Connection,
      useFactory: async (cfg: ConfigService) =>
        await createConnection({
          type: 'mysql',
          url: cfg.get('BACKUP_DB_URL'),
          name: 'esdb-backup',
          entities: [EventTypeormEntity],
        }),
      inject: [ConfigService],
    },
  ],
})
export class EsdbBackupModule {}
