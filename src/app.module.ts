import { Module } from '@nestjs/common'
import { DiscordModule } from './discord/discord.module'
import { ConfigModule } from '@nestjs/config'
import { TypeormModule } from './typeorm/typeorm.module'
import { CommandoModule } from './commando/commando.module'
import { CommandHandlersModule } from './command-handlers/command-handlers.module'
import { LoggerModule } from './logger/logger.module'
import { EventStoreModule } from './event-store/event-store.module'
import { WriteRepositoriesModule } from './write-repositories/write-repositories.module'
import { ReadRepositoriesModule } from './read-repositories/read-repositories.module'
import { ServicesModule } from './services/services.module'
import { InfraCommandHandlersModule } from './infra-command-handlers/infra-command-handlers.module'
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
    ReadRepositoriesModule,
    ServicesModule,
    InfraCommandHandlersModule,
  ],
})
export class AppModule {}
