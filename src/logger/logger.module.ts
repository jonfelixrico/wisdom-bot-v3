import { Logger, Module, Provider } from '@nestjs/common'
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
  WINSTON_MODULE_NEST_PROVIDER,
} from 'nest-winston'
import * as winston from 'winston'

const dynamicWinstonModule = WinstonModule.forRoot({
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
})

const loggerProvider: Provider = {
  provide: Logger,
  useFactory: (logger: Logger) => logger,
  inject: [WINSTON_MODULE_NEST_PROVIDER],
}

@Module({
  imports: [dynamicWinstonModule],
  providers: [loggerProvider],
  exports: [dynamicWinstonModule, loggerProvider],
})
export class LoggerModule {}
