import { Module } from '@nestjs/common'
import { SubmitCommandService } from './submit-command/submit-command.service'
import { ReceiveCommandService } from './receive-command/receive-command.service'
import { DiscordModule } from 'src/discord/discord.module'
import { RepositoriesModule } from 'src/repositories/repositories.module'
import { SetupService } from './setup/setup.service'
import { ConcurCommandService } from './concur-command/concur-command.service'
import { ReactionListenerService } from './reaction-listener/reaction-listener.service'
import { PendingQuoteMessageRecacherService } from './pending-quote-message-recacher/pending-quote-message-recacher.service'
import { QuoteApproverService } from './quote-approver/quote-approver.service'
import { QuoteRegeneratorService } from './quote-regenerator/quote-regenerator.service'
import { DeleteListenerService } from './delete-listener/delete-listener.service'
import { StatsCommandService } from './stats-command/stats-command.service'
import { CqrsModule } from '@nestjs/cqrs'

@Module({
  imports: [DiscordModule, RepositoriesModule, CqrsModule],
  providers: [
    SetupService,
    SubmitCommandService,
    // ReceiveCommandService,
    // ConcurCommandService,
    ReactionListenerService,
    // PendingQuoteMessageRecacherService,
    QuoteApproverService,
    // QuoteRegeneratorService,
    DeleteListenerService,
    // StatsCommandService,
  ],
})
export class CommandoModule {}
