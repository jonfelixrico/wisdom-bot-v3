import { Module } from '@nestjs/common'
import { ReceiveRepoImplService } from './receive-repo-impl/receive-repo-impl.service'
import { QuoteRepoImplService } from './quote-repo-impl/quote-repo-impl.service'
import { ConcurRepoImplService } from './concur-repo-impl/concur-repo-impl.service'

@Module({
  providers: [
    ReceiveRepoImplService,
    QuoteRepoImplService,
    ConcurRepoImplService,
  ],
})
export class RepositoriesModule {}
