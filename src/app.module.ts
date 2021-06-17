import { Module } from '@nestjs/common'
import { DiscordModule } from './discord/discord.module'
import { ConfigModule } from '@nestjs/config'
import { RepositoriesModule } from './repositories/repositories.module'
import { TypeormModule } from './typeorm/typeorm.module'
import { CommandoModule } from './commando/commando.module'
import { CommandHandlersModule } from './command-handlers/command-handlers.module'
import { EventHandlersModule } from './event-handlers/event-handlers.module'
import { LoggerModule } from './logger/logger.module'
import { EventStoreModule } from './event-store/event-store.module'
import { WriteRepositoriesModule } from './write-repositories/write-repositories.module'

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', '.dev.env'],
      isGlobal: true,
    }),
    TypeormModule,
    DiscordModule,
    RepositoriesModule,
    CommandoModule,
    CommandHandlersModule,
    EventHandlersModule,
    EventStoreModule,
    WriteRepositoriesModule,
  ],
})
export class AppModule {}
