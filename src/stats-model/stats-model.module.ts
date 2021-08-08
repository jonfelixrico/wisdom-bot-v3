import { Module } from '@nestjs/common'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { statsModelTypeormProvider } from './typeorm/stats-model-typeorm.provider'
import { StatsModelCatchUpService } from './services/catch-up/stats-model-catch-up.service'

@Module({
  imports: [EventStoreModule],
  providers: [statsModelTypeormProvider, StatsModelCatchUpService],
})
export class StatsModelModule {}
