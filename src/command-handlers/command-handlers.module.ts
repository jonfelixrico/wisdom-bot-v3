import { Module } from '@nestjs/common'
import { SubmitQuoteHandler } from './submit-quote/submit-quote.cmd-handler'

@Module({
  providers: [SubmitQuoteHandler],
})
export class CommandHandlersModule {}
