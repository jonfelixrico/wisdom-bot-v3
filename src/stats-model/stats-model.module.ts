import { Module } from '@nestjs/common'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { statsModelTypeormProvider } from './typeorm/stats-model-typeorm.provider'
import { StatsModelCatchUpService } from './services/catch-up/stats-model-catch-up.service'
import { GuildTopContributorsQueryHandlerService } from './query-handlers/guild-top-contributors-query-handler/guild-top-contributors-query-handler.service'
import { AuthorTopContributorsQueryHandlerService } from './query-handlers/author-top-contributors-query-handler/author-top-contributors-query-handler.service'
import { CqrsModule } from '@nestjs/cqrs'
import { AuthorTopReceiversQueryHandlerService } from './query-handlers/author-top-receivers-query-handler/author-top-receivers-query-handler.service'
import { GuildTopReceiversQueryHandlerService } from './query-handlers/guild-top-receivers-query-handler/guild-top-receivers-query-handler.service'
import { GuildTopReceivedQuotesQueryHandlerService } from './query-handlers/guild-top-received-quotes-query-handler/guild-top-received-quotes-query-handler.service'
import { GuildTopReceivedAuthorsQueryHandlerService } from './query-handlers/guild-top-received-authors-query-handler/guild-top-received-authors-query-handler.service'
import { AuthorTopReceivedQuotesQueryHandlerService } from './query-handlers/author-top-received-quotes-query-handler/author-top-received-quotes-query-handler.service'

@Module({
  imports: [EventStoreModule, CqrsModule],
  providers: [
    statsModelTypeormProvider,
    StatsModelCatchUpService,
    GuildTopContributorsQueryHandlerService,
    AuthorTopContributorsQueryHandlerService,
    AuthorTopReceiversQueryHandlerService,
    GuildTopReceiversQueryHandlerService,
    GuildTopReceivedQuotesQueryHandlerService,
    GuildTopReceivedAuthorsQueryHandlerService,
    AuthorTopReceivedQuotesQueryHandlerService,
  ],
})
export class StatsModelModule {}
