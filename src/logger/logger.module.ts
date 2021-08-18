import { Global, Logger, Module, Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CqrsModule } from '@nestjs/cqrs'
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
  WINSTON_MODULE_NEST_PROVIDER,
} from 'nest-winston'
import * as winston from 'winston'

const dynamicWinstonModule = WinstonModule.forRootAsync({
  useFactory: (cfg: ConfigService) => ({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike(),
        ),
        level: cfg.get('LOGGING_LEVEL') || null,
      }),
      // other transports...
    ],
    // other options
  }),
  inject: [ConfigService],
})

const loggerProvider: Provider = {
  provide: Logger,
  useFactory: (logger: Logger) => logger,
  inject: [WINSTON_MODULE_NEST_PROVIDER],
}

@Global()
@Module({
  imports: [dynamicWinstonModule, CqrsModule],
  providers: [loggerProvider],
  exports: [dynamicWinstonModule, loggerProvider, CqrsModule],
})
export class LoggerModule {}
