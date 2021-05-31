import { Module } from '@nestjs/common'
import { ReceiveRepoImplService } from './receive-repo-impl/receive-repo-impl.service'
import { QuoteRepoImplService } from './quote-repo-impl/quote-repo-impl.service'
import { ConcurRepoImplService } from './concur-repo-impl/concur-repo-impl.service'
import { TypeormModule } from 'src/typeorm/typeorm.module'
import { QuoteRepository } from 'src/classes/quote-repository.abstract'
import { ReceiveRepository } from 'src/classes/receive-repository.abstract'
import { ConcurRepository } from 'src/classes/concur-repository.abstract'

const providers = [
  {
    useClass: ReceiveRepoImplService,
    provide: ReceiveRepository,
  },
  {
    useClass: QuoteRepoImplService,
    provide: QuoteRepository,
  },
  {
    useClass: ConcurRepoImplService,
    provide: ConcurRepository,
  },
]

@Module({
  imports: [TypeormModule],
  providers,
  exports: providers,
})
export class RepositoriesModule {}
