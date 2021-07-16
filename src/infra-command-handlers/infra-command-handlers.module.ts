import { Module } from '@nestjs/common'
import { RegeneratePendingQuoteMessageCommandHandlerService } from './regenerate-pending-quote-message-command-handler/regenerate-pending-quote-message-command-handler.service'

@Module({
  providers: [RegeneratePendingQuoteMessageCommandHandlerService],
})
export class InfraCommandHandlersModule {}
