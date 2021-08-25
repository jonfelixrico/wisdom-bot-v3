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
import { StatsServerGeneralInteractionHandlerService } from './handlers/stats-server-general-interaction-handler/stats-server-general-interaction-handler.service'
import { StatsServerTopcontributorsInteractionHandlerService } from './handlers/stats-server-topcontributors-interaction-handler/stats-server-topcontributors-interaction-handler.service'
import { StatsServerTopreceiversInteractionHandlerService } from './handlers/stats-server-topreceivers-interaction-handler/stats-server-topreceivers-interaction-handler.service'
import { StatsServerTopauthorsInteractionHandlerService } from './handlers/stats-server-topauthors-interaction-handler/stats-server-topauthors-interaction-handler.service'
import { StatsServerTopquotesInteractionHandlerService } from './handlers/stats-server-topquotes-interaction-handler/stats-server-topquotes-interaction-handler.service'
import { StatsUserTopauthoredquotesInteractionHandlerService } from './handlers/stats-user-topquotes-interaction-handler/stats-user-topauthoredquotes-interaction-handler.service'
import { StatsUserTopcontributorsInteractionHandlerService } from './handlers/stats-user-topcontributors-interaction-handler/stats-user-topcontributors-interaction-handler.service'
import { StatsUserTopreceiversInteractionHandlerService } from './handlers/stats-user-topreceivers-interaction-handler/stats-user-topreceivers-interaction-handler.service'
import { StatsUserGeneralInteractionHandlerService } from './handlers/stats-user-general-interaction-handler/stats-user-general-interaction-handler.service'
import { ReceiveMessageUpdaterService } from './downstream/receive-message-updater/receive-message-updater.service';

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
    StatsServerGeneralInteractionHandlerService,
    StatsServerTopcontributorsInteractionHandlerService,
    StatsServerTopreceiversInteractionHandlerService,
    StatsServerTopauthorsInteractionHandlerService,
    StatsServerTopquotesInteractionHandlerService,
    StatsUserTopauthoredquotesInteractionHandlerService,
    StatsUserTopcontributorsInteractionHandlerService,
    StatsUserTopreceiversInteractionHandlerService,
    StatsUserGeneralInteractionHandlerService,
    ReceiveMessageUpdaterService,
  ],
})
export class DiscordInteractionsModule {}
