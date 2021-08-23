import { Module } from '@nestjs/common'
import { discordProviders } from './discord.provider'
import { DiscordHelperService } from './discord-helper/discord-helper.service'

const exportedProviders = [...discordProviders, DiscordHelperService]

@Module({
  providers: [...exportedProviders],
  exports: exportedProviders,
})
export class DiscordModule {}
