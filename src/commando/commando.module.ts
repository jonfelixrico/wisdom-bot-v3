import { Module } from '@nestjs/common'
import { SubmitCommandService } from './submit-command/submit-command.service'
import { ReceiveCommandService } from './receive-command/receive-command.service'
import { DiscordModule } from 'src/discord/discord.module'
import { RepositoriesModule } from 'src/repositories/repositories.module'
import { SetupService } from './setup/setup.service'
import { ConcurCommandService } from './concur-command/concur-command.service'
import { ReactionListenerService } from './reaction-listener/reaction-listener.service'
import { PendingQuoteMessageRecacherService } from './pending-quote-message-recacher/pending-quote-message-recacher.service'

@Module({
  imports: [DiscordModule, RepositoriesModule],
  providers: [
    SetupService,
    SubmitCommandService,
    ReceiveCommandService,
    ConcurCommandService,
    ReactionListenerService,
    PendingQuoteMessageRecacherService,
  ],
})
export class CommandoModule {}
