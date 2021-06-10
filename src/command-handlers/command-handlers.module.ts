import { Module } from '@nestjs/common'
import { SubmitQuoteCommandHandlerService } from './pending-quote/submit-quote-command-handler/submit-quote-command-handler.service'
import { AcceptPendingQuoteCommandHandlerService } from './pending-quote/accept-pending-quote-command-handler/accept-pending-quote-command-handler.service'
import { CancelPendingQuoteCommandHandlerService } from './pending-quote/cancel-pending-quote-command-handler/cancel-pending-quote-command-handler.service'

@Module({
  providers: [
    SubmitQuoteCommandHandlerService,
    AcceptPendingQuoteCommandHandlerService,
    CancelPendingQuoteCommandHandlerService,
  ],

  // TODO import repository
})
export class CommandHandlersModule {}
