import { Module } from '@nestjs/common'
import { DiscordModule } from 'src/discord/discord.module'
import { InteractionCreatedRelayService } from './services/interaction-created-relay/interaction-created-relay.service'
import { ReceiveInteractionHandlerService } from './handlers/receive-interaction-handler/receive-interaction-handler.service'
import { CommandManagerService } from './services/command-manager/command-manager.service'
import { ReadModelQueryModule } from 'src/read-model-query/read-model-query.module'
import { SubmitInteractionHandlerService } from './handlers/submit-interaction-handler/submit-interaction-handler.service'
import { QuoteVoteBtnInteractionHandlerService } from './handlers/quote-vote-btn-interaction-handler/quote-vote-btn-interaction-handler.service'
import { PendingQuoteVoteChangeMessageUpdaterService } from './downstream/pending-quote-vote-change-message-updater/pending-quote-vote-change-message-updater.service'
import { PendingQuoteResponseGeneratorService } from './services/pending-quote-response-generator/pending-quote-response-generator.service'
import { QuoteAcceptedAnnouncerService } from './downstream/quote-accepted-announcer/quote-accepted-announcer.service'
import { QuoteExpiredAnnouncerService } from './downstream/quote-expired-announcer/quote-expired-announcer.service'
import { ServerGeneralStatsInteractionHandlerService } from './handlers/server-general-stats-interaction-handler/server-general-stats-interaction-handler.service'
import { ServerStatsTopcontributorsInteractionHandlerService } from './handlers/server-stats-topcontributors-interaction-handler/server-stats-topcontributors-interaction-handler.service'
import { ServerStatsTopreceiversInteractionHandlerService } from './handlers/server-stats-topreceivers-interaction-handler/server-stats-topreceivers-interaction-handler.service'

@Module({
  imports: [DiscordModule, ReadModelQueryModule],
  providers: [
    InteractionCreatedRelayService,
    ReceiveInteractionHandlerService,
    CommandManagerService,
    SubmitInteractionHandlerService,
    QuoteVoteBtnInteractionHandlerService,
    PendingQuoteVoteChangeMessageUpdaterService,
    PendingQuoteResponseGeneratorService,
    QuoteAcceptedAnnouncerService,
    QuoteExpiredAnnouncerService,
    ServerGeneralStatsInteractionHandlerService,
    ServerStatsTopcontributorsInteractionHandlerService,
    ServerStatsTopreceiversInteractionHandlerService,
  ],
})
export class DiscordInteractionsModule {}
