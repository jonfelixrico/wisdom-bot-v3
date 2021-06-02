import { Injectable } from '@nestjs/common'
import { Guild, GuildChannel, TextChannel } from 'discord.js'
import { CommandoClient } from 'discord.js-commando'

@Injectable()
export class GuildRepoService {
  constructor(private client: CommandoClient) {}

  async getGuild(guildId: string): Promise<Guild | null> {
    const { guilds } = this.client

    const cached = guilds.cache.get(guildId)
    if (cached) {
      return cached
    }

    return await guilds.fetch(guildId)
  }

  async getChannel(
    guildId: string,
    channelId: string,
  ): Promise<GuildChannel | null> {
    const guild = await this.getGuild(guildId)
    if (!guild) {
      return null
    }

    const { channels } = guild

    const cached = channels.cache.get(channelId)
    if (cached) {
      return cached
    }

    return await channels.resolve(channelId)
  }

  async getTextChannel(
    guildId: string,
    channelId: string,
  ): Promise<TextChannel | null> {
    const channel = await this.getChannel(guildId, channelId)
    if (!channel || !(channel instanceof TextChannel)) {
      return null
    }

    return channel
  }
}
