import { Module } from '@nestjs/common'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { TypeormModule } from 'src/typeorm/typeorm.module'

@Module({
  imports: [TypeormModule, EventStoreModule],
})
export class StatsQueryModule {}
