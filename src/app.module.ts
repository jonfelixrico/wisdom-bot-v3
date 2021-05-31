import { Module } from '@nestjs/common'
import { discordProvider } from './discord/discord.provider'
import { DiscordModule } from './discord/discord.module'

@Module({
  providers: [discordProvider],
  imports: [DiscordModule],
})
export class AppModule {}
