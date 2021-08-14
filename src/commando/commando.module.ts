import { Module } from '@nestjs/common'
import { SubmitCommandService } from './handlers/submit-command/submit-command.service'
import { DiscordModule } from 'src/discord/discord.module'
import { SetupService } from './services/setup/setup.service'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeormModule } from 'src/typeorm/typeorm.module'
import { ReceiveCommandService } from './handlers/receive-command/receive-command.service'
import { ReactionHelperService } from '../discord-watchers/reaction-helper/reaction-helper.service'
// import { UpvoteCommandService } from './handlers/upvote-command/upvote-command.service'
// import { DownvoteCommandService } from './handlers/downvote-command/downvote-command.service'
import { UserStatsCommandService } from './handlers/user-stats-command/user-stats-command.service'
import { GuildStatsCommandService } from './handlers/guild-stats-command/guild-stats-command.service'
import { ReadModelQueryModule } from 'src/read-model-query/read-model-query.module'
import { TopContributorsCommandService } from './handlers/top-contributors-command/top-contributors-command.service'
import { TopAuthorsCommandService } from './handlers/top-authors-command/top-authors-command.service'
import { GuildTopQuoteService } from './handlers/guild-top-quote/guild-top-quote.service'
import { UserTopQuoteService } from './handlers/user-top-quote/user-top-quote.service'
import { GuildTopReceiversCommandService } from './handlers/guild-top-receivers-command/guild-top-receivers-command.service'
import { AuthorTopReceiversCommandService } from './handlers/author-top-receivers-command/author-top-receivers-command.service'
// import { InfoCommandService } from './handlers/info-command/info-command.service'

@Module({
  imports: [DiscordModule, CqrsModule, TypeormModule, ReadModelQueryModule],
  providers: [
    SetupService,
    SubmitCommandService,
    ReceiveCommandService,
    ReactionHelperService,
    // UpvoteCommandService,
    // DownvoteCommandService,
    UserStatsCommandService,
    GuildStatsCommandService,
    TopContributorsCommandService,
    TopAuthorsCommandService,
    GuildTopQuoteService,
    UserTopQuoteService,
    GuildTopReceiversCommandService,
    AuthorTopReceiversCommandService,
    // InfoCommandService,
  ],
})
export class CommandoModule {}
