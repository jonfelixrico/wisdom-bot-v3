import { Module } from '@nestjs/common'
import { discordProvider } from './discord.provider'

@Module({
  providers: [discordProvider],
  exports: [discordProvider],
})
export class DiscordModule {}
