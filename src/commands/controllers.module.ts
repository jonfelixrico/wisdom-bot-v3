import { Module } from '@nestjs/common'
import { DiscordModule } from 'src/discord/discord.module'

@Module({
  imports: [DiscordModule],
})
export class CommandsModule {}
