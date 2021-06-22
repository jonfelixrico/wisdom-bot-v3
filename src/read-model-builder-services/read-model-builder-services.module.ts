import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { EventStoreModule } from 'src/event-store/event-store.module'

@Module({
  imports: [EventStoreModule, CqrsModule],
})
export class ReadModelBuilderServicesModule {}
