import { Module } from '@nestjs/common'
import { SubmitCommandService } from './handlers/submit-command/submit-command.service'
import { DiscordModule } from 'src/discord/discord.module'
import { SetupService } from './services/setup/setup.service'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeormModule } from 'src/typeorm/typeorm.module'
import { ReceiveCommandService } from './handlers/receive-command/receive-command.service'
import { ReadRepositoriesModule } from 'src/read-repositories/read-repositories.module'
import { InteractionHelperService } from './services/interaction-helper/interaction-helper.service'
import { UpvoteCommandService } from './handlers/upvote-command/upvote-command.service'
import { DownvoteCommandService } from './handlers/downvote-command/downvote-command.service'

@Module({
  imports: [DiscordModule, CqrsModule, TypeormModule, ReadRepositoriesModule],
  providers: [
    SetupService,
    SubmitCommandService,
    ReceiveCommandService,
    InteractionHelperService,
    UpvoteCommandService,
    DownvoteCommandService,
  ],
})
export class CommandoModule {}
