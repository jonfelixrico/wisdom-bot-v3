import { Module } from '@nestjs/common'
import { MessageRecacheService } from './message-recache/message-recache.service'
import { MessageRegenerationService } from './message-regeneration/message-regeneration.service'

@Module({
  providers: [MessageRecacheService, MessageRegenerationService],
})
export class ServicesModule {}
