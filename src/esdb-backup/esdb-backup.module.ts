import { Module } from '@nestjs/common'
import { Connection, createConnection } from 'typeorm'
import { ConfigService } from '@nestjs/config'

@Module({
  providers: [
    {
      provide: Connection,
      useFactory: async (cfg: ConfigService) =>
        await createConnection({
          type: 'mysql',
          url: cfg.get('BACKUP_DB_URL'),
          entities: [__dirname + '/**/*.typeorm-entity{.ts,.js}'],
          name: 'esdb-backup',
        }),
      inject: [ConfigService],
    },
  ],
})
export class EsdbBackupModule {}
