import { Module } from '@nestjs/common'
import { SubmitCommandService } from './handlers/submit-command/submit-command.service'
import { DiscordModule } from 'src/discord/discord.module'
import { SetupService } from './services/setup/setup.service'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeormModule } from 'src/typeorm/typeorm.module'
import { ReceiveCommandService } from './handlers/receive-command/receive-command.service'
import { ReadRepositoriesModule } from 'src/read-repositories/read-repositories.module'
import { ConcurCommandService } from './handlers/concur-command/concur-command.service'

@Module({
  imports: [DiscordModule, CqrsModule, TypeormModule, ReadRepositoriesModule],
  providers: [
    SetupService,
    SubmitCommandService,
    ReceiveCommandService,
    ConcurCommandService,
  ],
})
export class CommandoModule {}
