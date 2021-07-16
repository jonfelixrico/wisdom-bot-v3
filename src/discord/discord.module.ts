import { Module } from '@nestjs/common'
import { discordProviders } from './discord.provider'
import { GuildRepoService } from './guild-repo/guild-repo.service'
import { DiscordHelperService } from './discord-helper/discord-helper.service'

const exportedProviders = [
  ...discordProviders,
  GuildRepoService,
  DiscordHelperService,
]

@Module({
  providers: [...exportedProviders],
  exports: exportedProviders,
})
export class DiscordModule {}
