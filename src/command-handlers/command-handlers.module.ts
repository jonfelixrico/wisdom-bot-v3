import { Module } from '@nestjs/common'
import { SubmitQuoteCommandHandlerService } from './pending-quote/submit-quote-command-handler/submit-quote-command-handler.service'
import { WriteRepositoriesModule } from 'src/write-repositories/write-repositories.module'
import { AcceptQuoteCommandHandlerService } from './pending-quote/accept-quote-command-handler/accept-quote-command-handler.service'
import { ReceiveQuoteCommandHandlerService } from './quote/receive-quote-command-handler/receive-quote-command-handler.service'
import { ReactToReceiveCommandHandlerService } from './receive/react-to-receive-command-handler/react-to-receive-command-handler.service'
import { UpdateQuoteMessageDetailsCommandHandlerService } from './pending-quote/update-quote-message-details-command-handler/update-quote-message-details-command-handler.service'
import { DiscordModule } from 'src/discord/discord.module'
import { AcknowledgeQuoteExpirationCommandHandlerService } from './pending-quote/acknowledge-quote-expiration-command-handler/acknowledge-quote-expiration-command-handler.service'
import { CastPendingQuoteVoteCommandHandlerService } from './pending-quote/cast-pending-quote-vote-command-handler/cast-pending-quote-vote-command-handler.service'
import { UpdateReceiveMessageDetailsCommandHandlerService } from './receive/update-receive-message-details-command-handler/update-receive-message-details-command-handler.service'

@Module({
  imports: [WriteRepositoriesModule, DiscordModule],
  providers: [
    SubmitQuoteCommandHandlerService,
    AcceptQuoteCommandHandlerService,
    ReceiveQuoteCommandHandlerService,
    ReactToReceiveCommandHandlerService,
    UpdateQuoteMessageDetailsCommandHandlerService,
    AcknowledgeQuoteExpirationCommandHandlerService,
    CastPendingQuoteVoteCommandHandlerService,
    UpdateReceiveMessageDetailsCommandHandlerService,
  ],

  // TODO import repository
})
export class CommandHandlersModule {}
