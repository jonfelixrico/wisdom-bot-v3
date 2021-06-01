import { Module } from '@nestjs/common'
import { SubmitCommandService } from './submit-command/submit-command.service'
import { ReceiveCommandService } from './receive-command/receive-command.service'

@Module({
  providers: [SubmitCommandService, ReceiveCommandService],
})
export class CommandoModule {}
