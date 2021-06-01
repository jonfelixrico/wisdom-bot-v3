import { Module } from '@nestjs/common'
import { SubmitCommandService } from './submit-command/submit-command.service'
import { ReceiveCommandService } from './receive-command/receive-command.service'
import { DiscordModule } from 'src/discord/discord.module'
import { RepositoriesModule } from 'src/repositories/repositories.module'

@Module({
  imports: [DiscordModule, RepositoriesModule],
  providers: [SubmitCommandService, ReceiveCommandService],
})
export class CommandoModule {}
