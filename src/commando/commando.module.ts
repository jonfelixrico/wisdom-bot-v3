import { Module } from '@nestjs/common'
import { SubmitCommandService } from './handlers/submit-command/submit-command.service'
import { DiscordModule } from 'src/discord/discord.module'
import { SetupService } from './services/setup/setup.service'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeormModule } from 'src/typeorm/typeorm.module'
import { ReceiveCommandService } from './handlers/receive-command/receive-command.service'
import { ReactionHelperService } from './services/reaction-helper/reaction-helper.service'
import { UpvoteCommandService } from './handlers/upvote-command/upvote-command.service'
import { DownvoteCommandService } from './handlers/downvote-command/downvote-command.service'
import { UserStatsCommandService } from './handlers/user-stats-command/user-stats-command.service'
import { GuildStatsCommandService } from './handlers/guild-stats-command/guild-stats-command.service'
import { ReadModelQueryModule } from 'src/read-model-query/read-model-query.module'
import { GuildTopContributorsService } from './handlers/guild-top-contributors/guild-top-contributors.service'
import { UserTopContributorsService } from './handlers/user-top-contributors/user-top-contributors.service'

@Module({
  imports: [DiscordModule, CqrsModule, TypeormModule, ReadModelQueryModule],
  providers: [
    SetupService,
    SubmitCommandService,
    ReceiveCommandService,
    ReactionHelperService,
    UpvoteCommandService,
    DownvoteCommandService,
    UserStatsCommandService,
    GuildStatsCommandService,
    GuildTopContributorsService,
    UserTopContributorsService,
  ],
})
export class CommandoModule {}
