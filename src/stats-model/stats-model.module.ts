import { Module } from '@nestjs/common'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { statsModelTypeormProviders } from './typeorm/stats-model-typeorm.providers'
import { StatsModelCatchUpService } from './services/catch-up/stats-model-catch-up.service'
import { GuildTopContributorsQueryHandlerService } from './query-handlers/guild-top-contributors-query-handler/guild-top-contributors-query-handler.service'
import { AuthorTopContributorsQueryHandlerService } from './query-handlers/author-top-contributors-query-handler/author-top-contributors-query-handler.service'
import { CqrsModule } from '@nestjs/cqrs'

@Module({
  imports: [EventStoreModule, CqrsModule],
  providers: [
    ...statsModelTypeormProviders,
    StatsModelCatchUpService,
    GuildTopContributorsQueryHandlerService,
    AuthorTopContributorsQueryHandlerService,
  ],
})
export class StatsModelModule {}
