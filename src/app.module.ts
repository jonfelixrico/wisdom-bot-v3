import { Module } from '@nestjs/common'
import { DiscordModule } from './discord/discord.module'
import { ConfigModule } from '@nestjs/config'
import { RepositoriesModule } from './repositories/repositories.module'
import { TypeormModule } from './typeorm/typeorm.module'
import { CommandoModule } from './commando/commando.module'
import { CommandHandlersModule } from './command-handlers/command-handlers.module'
import { EventHandlersModule } from './event-handlers/event-handlers.module'
import { EventSourcingModule } from './event-sourcing/event-sourcing.module'
import { LoggerModule } from './logger/logger.module'

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
    EventSourcingModule,
  ],
})
export class AppModule {}
