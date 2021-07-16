import { Module } from '@nestjs/common'
import { SubmitQuoteCommandHandlerService } from './pending-quote/submit-quote-command-handler/submit-quote-command-handler.service'
import { CqrsModule } from '@nestjs/cqrs'
import { WriteRepositoriesModule } from 'src/write-repositories/write-repositories.module'
import { AcceptQuoteCommandHandlerService } from './pending-quote/accept-quote-command-handler/accept-quote-command-handler.service'
import { ReceiveQuoteCommandHandlerService } from './quote/receive-quote-command-handler/receive-quote-command-handler.service'
import { InteractReceiveCommandHandlerService } from './receive/interact-receive-command-handler/interact-receive-command-handler.service'
import { UpdateQuoteMessageIdCommandHandlerService } from './pending-quote/update-quote-message-id-command-handler/update-quote-message-id-command-handler.service'

@Module({
  imports: [CqrsModule, WriteRepositoriesModule],
  providers: [
    SubmitQuoteCommandHandlerService,
    AcceptQuoteCommandHandlerService,
    ReceiveQuoteCommandHandlerService,
    InteractReceiveCommandHandlerService,
    UpdateQuoteMessageIdCommandHandlerService,
  ],

  // TODO import repository
})
export class CommandHandlersModule {}
