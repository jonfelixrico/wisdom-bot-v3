import { Module } from '@nestjs/common'
import { QuoteCatchUpService } from './catch-up/quote-catch-up/quote-catch-up.service'
import { CatchUpOrchestratorService } from './catch-up/catch-up-orchestrator/catch-up-orchestrator.service'

@Module({
  providers: [QuoteCatchUpService, CatchUpOrchestratorService],
})
export class ReadRepositoriesModule {}
