import { Injectable } from '@nestjs/common'
import { Client, Guild, GuildChannel, TextChannel } from 'discord.js'

@Injectable()
export class GuildRepoService {
  constructor(private client: Client) {}

  async getGuild(guildId: string): Promise<Guild | null> {
    const { guilds } = this.client
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

  async deleteMessage(
    guildId: string,
    channelId: string,
    messageId: string,
    reason?: string,
  ): Promise<boolean> {
    const channel = await this.getTextChannel(guildId, channelId)
    if (!channel) {
      return false
    }

    const { messages } = channel
    await messages.delete(messageId, reason)
    return true
  }
}
