import { Module } from '@nestjs/common'
import { DiscordModule } from './discord/discord.module'
import { ConfigModule } from '@nestjs/config'
import { TypeormModule } from './typeorm/typeorm.module'
import { CommandHandlersModule } from './command-handlers/command-handlers.module'
import { GlobalModule } from './global/global.module'
import { EventStoreModule } from './event-store/event-store.module'
import { WriteRepositoriesModule } from './write-repositories/write-repositories.module'
import { ReadModelCatchUpModule } from './read-model-catch-up/read-model-catch-up.module'
import { ReadModelQueryModule } from './read-model-query/read-model-query.module'
import { EsdbBackupModule } from './esdb-backup/esdb-backup.module'
import { StatsModelModule } from './stats-model/stats-model.module'
import { DiscordInteractionsModule } from './discord-interactions/discord-interactions.module'
import { QuoteExpirationModule } from './quote-expiration/quote-expiration.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.dev.env'],
      isGlobal: true,
    }),
    TypeormModule,
    DiscordModule,
    CommandHandlersModule,
    EventStoreModule,
    WriteRepositoriesModule,
    ReadModelCatchUpModule,
    ReadModelQueryModule,
    EsdbBackupModule,
    StatsModelModule,
    DiscordInteractionsModule,

    GlobalModule,

    QuoteExpirationModule,
  ],
})
export class AppModule {}
