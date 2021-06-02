import { Module } from '@nestjs/common'
import { discordProviders } from './discord.provider'
import { GuildRepoService } from './guild-repo/guild-repo.service'

const providers = [...discordProviders, GuildRepoService]

@Module({
  providers,
  exports: providers,
})
export class DiscordModule {}
