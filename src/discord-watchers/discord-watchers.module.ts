import { Module } from '@nestjs/common'
import { ReadModelQueryModule } from 'src/read-model-query/read-model-query.module'
import { ReactionHelperService } from './reaction-helper/reaction-helper.service'

@Module({
  imports: [ReadModelQueryModule],
  providers: [ReactionHelperService],
})
export class DiscordWatchersModule {}
