import { Module, Logger } from '@nestjs/common'
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
  WINSTON_MODULE_NEST_PROVIDER,
} from 'nest-winston'
import * as winston from 'winston'
import { DiscordModule } from './discord/discord.module'
import { ConfigModule } from '@nestjs/config'
import { RepositoriesModule } from './repositories/repositories.module'
import { TypeormModule } from './typeorm/typeorm.module'
import { CommandoModule } from './commando/commando.module'
import { CommandHandlersModule } from './command-handlers/command-handlers.module'
import { EventHandlersModule } from './event-handlers/event-handlers.module'
import { EventSourcingModule } from './event-sourcing/event-sourcing.module'

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
        // other transports...
      ],
      // other options
    }),
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

  providers: [
    {
      provide: Logger,
      useExisting: [WINSTON_MODULE_NEST_PROVIDER],
    },
  ],
})
export class AppModule {}
