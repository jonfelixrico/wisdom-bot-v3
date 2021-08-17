import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { DiscordModule } from 'src/discord/discord.module'
import { InteractionCreatedRelayService } from './services/interaction-created-relay/interaction-created-relay.service'
import { ReceiveInteractionHandlerService } from './handlers/receive-interaction-handler/receive-interaction-handler.service'
import { CommandManagerService } from './services/command-manager/command-manager.service'
import { ReadModelQueryModule } from 'src/read-model-query/read-model-query.module'
import { SubmitInteractionHandlerService } from './handlers/submit-interaction-handler/submit-interaction-handler.service'
import { QuoteVoteBtnInteractionHandlerService } from './handlers/quote-vote-btn-interaction-handler/quote-vote-btn-interaction-handler.service'
import { PendingQuoteVoteChangeMessageUpdaterService } from './services/pending-quote-vote-change-message-updater/pending-quote-vote-change-message-updater.service'
import { PendingQuoteResponseGeneratorService } from './services/pending-quote-response-generator/pending-quote-response-generator.service'

@Module({
  imports: [DiscordModule, CqrsModule, ReadModelQueryModule],
  providers: [
    InteractionCreatedRelayService,
    ReceiveInteractionHandlerService,
    CommandManagerService,
    SubmitInteractionHandlerService,
    QuoteVoteBtnInteractionHandlerService,
    PendingQuoteVoteChangeMessageUpdaterService,
    PendingQuoteResponseGeneratorService,
  ],
})
export class DiscordInteractionsModule {}
