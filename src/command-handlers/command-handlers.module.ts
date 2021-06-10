import { Module } from '@nestjs/common'
import { SubmitQuoteCommandHandlerService } from './submit-quote-command-handler/submit-quote-command-handler.service'

@Module({
  providers: [SubmitQuoteCommandHandlerService],
})
export class CommandHandlersModule {}
