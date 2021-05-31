import { Module } from '@nestjs/common'
import { ReceiveRepoImplService } from './receive-repo-impl/receive-repo-impl.service'
import { QuoteRepoImplService } from './quote-repo-impl/quote-repo-impl.service'
import { ConcurRepoImplService } from './concur-repo-impl/concur-repo-impl.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Approval } from 'src/entities/approval.entity'
import { Quote } from 'src/entities/quote.entity'
import { Concur } from 'src/entities/concur.entity'
import { Receive } from 'src/entities/receive.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Approval, Quote, Concur, Receive])],
  providers: [
    ReceiveRepoImplService,
    QuoteRepoImplService,
    ConcurRepoImplService,
  ],
})
export class RepositoriesModule {}
