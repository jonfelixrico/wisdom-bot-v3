import { Module } from '@nestjs/common'
import { GuildRepository } from 'src/classes/guild-repository.abstract'
import { TypeormModule } from 'src/typeorm/typeorm.module'
import { GuildRepoImplService } from './deprecated/guild-repo-impl/guild-repo-impl.service'

const providers = [
  // TODO need to DDD-ify this
  {
    useClass: GuildRepoImplService,
    provide: GuildRepository,
  },
]

@Module({
  imports: [TypeormModule],
  providers,
  exports: providers,
})
export class RepositoriesModule {}
