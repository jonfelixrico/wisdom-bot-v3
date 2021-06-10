import { Module } from '@nestjs/common'
import { SubmitQuoteCommandHandlerService } from './submit-quote-command-handler/submit-quote-command-handler.service'
import { AcceptPendingQuoteCommandHandlerService } from './accept-pending-quote-command-handler/accept-pending-quote-command-handler.service'
import { CancelPendingQuoteCommandHandlerService } from './cancel-pending-quote-command-handler/cancel-pending-quote-command-handler.service'

@Module({
  providers: [
    SubmitQuoteCommandHandlerService,
    AcceptPendingQuoteCommandHandlerService,
    CancelPendingQuoteCommandHandlerService,
  ],
})
export class CommandHandlersModule {}
