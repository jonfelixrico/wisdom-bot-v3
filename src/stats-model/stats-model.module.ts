import { Module } from '@nestjs/common'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { dbProvider } from './db/db.provider'
import { StatsModelCatchUpService } from './event-sourcing/stats-model-catch-up/stats-model-catch-up.service'
import { GuildTopContributorsQueryHandlerService } from './queries/handlers/guild-top-contributors-query-handler/guild-top-contributors-query-handler.service'
import { UserTopContributorsQueryHandlerService } from './queries/handlers/user-top-contributors-query-handler/user-top-contributors-query-handler.service'
import { UserTopReceiversQueryHandlerService } from './queries/handlers/user-top-receivers-query-handler/user-top-receivers-query-handler.service'
import { GuildTopReceiversQueryHandlerService } from './queries/handlers/guild-top-receivers-query-handler/guild-top-receivers-query-handler.service'
import { GuildTopReceivedQuotesQueryHandlerService } from './queries/handlers/guild-top-received-quotes-query-handler/guild-top-received-quotes-query-handler.service'
import { GuildTopReceivedAuthorsQueryHandlerService } from './queries/handlers/guild-top-received-authors-query-handler/guild-top-received-authors-query-handler.service'
import { UserTopAuthoredQuotesQueryHandlerService } from './queries/handlers/user-top-authored-quotes-query-handler/user-top-authored-quotes-query-handler.service'
import { GuildStatsQueryHandlerService } from './queries/handlers/guild-stats-query-handler/guild-stats-query-handler.service'
import { UserStatsQueryHandlerService } from './queries/handlers/user-stats-query-handler/user-stats-query-handler.service'

@Module({
  imports: [EventStoreModule],
  providers: [
    dbProvider,
    StatsModelCatchUpService,
    GuildTopContributorsQueryHandlerService,
    UserTopContributorsQueryHandlerService,
    UserTopReceiversQueryHandlerService,
    GuildTopReceiversQueryHandlerService,
    GuildTopReceivedQuotesQueryHandlerService,
    GuildTopReceivedAuthorsQueryHandlerService,
    UserTopAuthoredQuotesQueryHandlerService,
    GuildStatsQueryHandlerService,
    UserStatsQueryHandlerService,
  ],
})
export class StatsModelModule {}
