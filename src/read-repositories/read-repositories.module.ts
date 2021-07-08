import { Module } from '@nestjs/common'
import { QuoteCatchUpService } from './catch-up/quote-catch-up/quote-catch-up.service'
import { CatchUpOrchestratorService } from './catch-up/catch-up-orchestrator/catch-up-orchestrator.service'
import { TypeormModule } from 'src/typeorm/typeorm.module'
import { EventStoreModule } from 'src/event-store/event-store.module'

@Module({
  providers: [QuoteCatchUpService, CatchUpOrchestratorService],
  imports: [TypeormModule, EventStoreModule],
})
export class ReadRepositoriesModule {}
