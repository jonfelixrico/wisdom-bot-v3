import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { ReadModelQueryModule } from 'src/read-model-query/read-model-query.module'
import { ReactionHelperService } from './reaction-helper/reaction-helper.service'

@Module({
  imports: [CqrsModule, ReadModelQueryModule],
  providers: [ReactionHelperService],
})
export class DiscordWatchersModule {}
