import { Module } from '@nestjs/common'
import { SubmitQuoteCommandHandlerService } from './pending-quote/submit-quote-command-handler/submit-quote-command-handler.service'
import { CqrsModule } from '@nestjs/cqrs'
import { WriteRepositoriesModule } from 'src/write-repositories/write-repositories.module'
import { AcceptQuoteCommandHandlerService } from './pending-quote/accept-quote-command-handler/accept-quote-command-handler.service'

@Module({
  imports: [CqrsModule, WriteRepositoriesModule],
  providers: [
    SubmitQuoteCommandHandlerService,
    AcceptQuoteCommandHandlerService,
  ],

  // TODO import repository
})
export class CommandHandlersModule {}
