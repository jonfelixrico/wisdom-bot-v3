import { Module } from '@nestjs/common'
import { DiscordModule } from './discord/discord.module'
import { ConfigModule } from '@nestjs/config'
import { TypeormModule } from './typeorm/typeorm.module'
import { CommandoModule } from './commando/commando.module'
import { CommandHandlersModule } from './command-handlers/command-handlers.module'
import { LoggerModule } from './logger/logger.module'
import { EventStoreModule } from './event-store/event-store.module'
import { WriteRepositoriesModule } from './write-repositories/write-repositories.module'
import { ReadModelCatchUpModule } from './read-model-catch-up/read-model-catch-up.module'
import { ServicesModule } from './services/services.module'
import { InfrastructureModule } from './infrastructure/infrastructure.module'
import { ReadModelQueryModule } from './read-model-query/read-model-query.module'

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', '.dev.env'],
      isGlobal: true,
    }),
    TypeormModule,
    DiscordModule,
    CommandoModule,
    CommandHandlersModule,
    EventStoreModule,
    WriteRepositoriesModule,
    ReadModelCatchUpModule,
    ServicesModule,
    InfrastructureModule,
    InfrastructureModule,
    ReadModelQueryModule,
  ],
})
export class AppModule {}
