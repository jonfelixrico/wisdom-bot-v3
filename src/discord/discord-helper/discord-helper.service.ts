import { Injectable } from '@nestjs/common'
import {
  Client,
  DiscordAPIError,
  Guild,
  GuildChannel,
  TextChannel,
} from 'discord.js'

function is404Error(e: Error) {
  return e instanceof DiscordAPIError && e.code === 404
}

@Injectable()
/**
 * Houses several methods which are basically wrappers for the default Discord API.
 * Usually the wrapping done here is null-handling for fetch-related operations.
 */
export class DiscordHelperService {
  constructor(private client: Client) {}

  async getGuild(guildId: string): Promise<Guild | null> {
    const { guilds } = this.client
    try {
      return await guilds.fetch(guildId)
    } catch (e) {
      if (is404Error(e)) {
        return null
      }

      throw e
    }
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

    const channel = channels.cache.get(channelId)
    if (channel) {
      return channel
    }

    try {
      return await channels.resolve(channelId)
    } catch (e) {
      if (is404Error(e)) {
        return null
      }

      throw e
    }
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

  async getMessage(guildId: string, channelId: string, messageId: string) {
    const channel = await this.getTextChannel(guildId, channelId)
    if (!channel) {
      return null
    }

    const { messages } = channel
    try {
      await messages.fetch(messageId)
    } catch (e) {
      if (is404Error(e)) {
        return null
      }

      throw e
    }
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
