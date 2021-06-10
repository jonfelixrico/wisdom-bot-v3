import { Module } from '@nestjs/common'
import { SubmitQuoteCommandHandlerService } from './pending-quote/submit-quote-command-handler/submit-quote-command-handler.service'
import { AcceptPendingQuoteCommandHandlerService } from './pending-quote/accept-pending-quote-command-handler/accept-pending-quote-command-handler.service'
import { CancelPendingQuoteCommandHandlerService } from './pending-quote/cancel-pending-quote-command-handler/cancel-pending-quote-command-handler.service'
import { ReceiveQuoteCommandHandlerService } from './quote/receive-quote-command-handler/receive-quote-command-handler.service'
import { InteractReceiveService } from './receive/interact-receive/interact-receive.service'

@Module({
  providers: [
    SubmitQuoteCommandHandlerService,
    AcceptPendingQuoteCommandHandlerService,
    CancelPendingQuoteCommandHandlerService,
    ReceiveQuoteCommandHandlerService,
    InteractReceiveService,
  ],

  // TODO import repository
})
export class CommandHandlersModule {}
