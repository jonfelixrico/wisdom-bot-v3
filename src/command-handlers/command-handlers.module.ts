import { Module } from '@nestjs/common'
import { SubmitQuoteCommandHandlerService } from './pending-quote/submit-quote-command-handler/submit-quote-command-handler.service'
import { CqrsModule } from '@nestjs/cqrs'
import { WriteRepositoriesModule } from 'src/write-repositories/write-repositories.module'

@Module({
  imports: [CqrsModule, WriteRepositoriesModule],
  providers: [SubmitQuoteCommandHandlerService],

  // TODO import repository
})
export class CommandHandlersModule {}
