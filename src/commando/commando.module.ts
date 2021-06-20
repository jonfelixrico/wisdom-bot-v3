import { Module } from '@nestjs/common'
import { SubmitCommandService } from './submit-command/submit-command.service'
import { DiscordModule } from 'src/discord/discord.module'
import { SetupService } from './setup/setup.service'
import { ReactionListenerService } from './reaction-listener/reaction-listener.service'
import { QuoteApproverService } from './quote-approver/quote-approver.service'
import { DeleteListenerService } from './delete-listener/delete-listener.service'
import { CqrsModule } from '@nestjs/cqrs'

@Module({
  imports: [DiscordModule, CqrsModule],
  providers: [
    SetupService,
    SubmitCommandService,
    ReactionListenerService,
    QuoteApproverService,
    DeleteListenerService,
  ],
})
export class CommandoModule {}
