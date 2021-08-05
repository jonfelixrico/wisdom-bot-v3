import { Module } from '@nestjs/common'
import { Connection, createConnection } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { EventTypeormEntity } from './event.typeorm-entity'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { BackupCatchUpService } from './backup-catch-up/backup-catch-up.service'

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
          synchronize: !!cfg.get('BACKUP_DB_SYNC'),
        }),
      inject: [ConfigService],
    },
    BackupCatchUpService,
  ],
  imports: [EventStoreModule],
})
export class EsdbBackupModule {}
