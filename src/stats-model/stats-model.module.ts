import { Module } from '@nestjs/common'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { statsModelTypeormProvider } from './typeorm/stats-model-typeorm.provider'

@Module({
  imports: [EventStoreModule],
  providers: [statsModelTypeormProvider],
})
export class StatsModelModule {}
