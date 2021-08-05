import { Module } from '@nestjs/common'
import { Connection, createConnection } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { EventTypeormEntity } from './event.typeorm-entity'
import { EventStoreModule } from 'src/event-store/event-store.module'

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
  imports: [EventStoreModule],
})
export class EsdbBackupModule {}
