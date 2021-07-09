import { Module } from '@nestjs/common'
import { SubmitCommandService } from './submit-command/submit-command.service'
import { DiscordModule } from 'src/discord/discord.module'
import { SetupService } from './setup/setup.service'
import { ReactionListenerService } from './reaction-listener/reaction-listener.service'
import { QuoteApproverService } from './quote-approver/quote-approver.service'
import { DeleteListenerService } from './delete-listener/delete-listener.service'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeormModule } from 'src/typeorm/typeorm.module'
import { ReceiveCommandService } from './receive-command/receive-command.service'
import { ReadRepositoriesModule } from 'src/read-repositories/read-repositories.module'

@Module({
  imports: [DiscordModule, CqrsModule, TypeormModule, ReadRepositoriesModule],
  providers: [
    SetupService,
    SubmitCommandService,
    ReactionListenerService,
    QuoteApproverService,
    DeleteListenerService,
    ReceiveCommandService,
  ],
})
export class CommandoModule {}
