import { Module } from '@nestjs/common'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { statsModelTypeormProvider } from './typeorm/stats-model-typeorm.provider'
import { CatchUpService } from './services/catch-up/catch-up.service'

@Module({
  imports: [EventStoreModule],
  providers: [statsModelTypeormProvider, CatchUpService],
})
export class StatsModelModule {}
