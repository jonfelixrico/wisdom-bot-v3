import { Injectable } from '@nestjs/common'
import { Client, DiscordAPIError, Guild, TextChannel } from 'discord.js'

function is404Error(e: Error) {
  return e instanceof DiscordAPIError && e.httpStatus === 404
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
      const guild = await guilds.fetch(guildId)

      /*
       * From https://discord.js.org/#/docs/main/stable/class/Guild's notes
       * "It's recommended to see if a guild is available before performing operations or reading data from it. You can check this with guild.available."
       *
       * Not being able to read data from a guild is critical to our use cases, so if we're not allowed to do such things to that guild, we'll consider it
       * as not found.
       */
      return guild.available ? guild : null
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
    const guild = await this.getGuild(guildId)
    if (!guild) {
      return null
    }

    const { channels } = guild

    // first, we try to take the channel from the cache
    const fromCache = channels.cache.get(channelId)
    if (fromCache) {
      // we'll automatically return null if not a text channel
      return fromCache.type === 'GUILD_TEXT' ? (fromCache as TextChannel) : null
    }

    try {
      const fromResolve = await channels.resolve(channelId)
      return fromResolve.type === 'GUILD_TEXT'
        ? (fromResolve as TextChannel)
        : null
    } catch (e) {
      if (is404Error(e)) {
        // if resovle doesn't find the channel, it will throw an error instead
        return null
      }

      throw e
    }
  }

  async getMessage(guildId: string, channelId: string, messageId: string) {
    const channel = await this.getTextChannel(guildId, channelId)
    if (!channel) {
      return null
    }

    const { messages } = channel
    try {
      return await messages.fetch(messageId)
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
  ): Promise<boolean> {
    const channel = await this.getTextChannel(guildId, channelId)
    if (!channel) {
      return false
    }

    const { messages } = channel
    try {
      await messages.delete(messageId)
      return true
    } catch (e) {
      if (is404Error(e)) {
        return false
      }

      throw e
    }
  }

  async getGuildMember(guildId: string, userId: string) {
    const guild = await this.getGuild(guildId)

    if (!guild) {
      return null
    }

    const { members } = guild

    try {
      return await members.fetch(userId)
    } catch (e) {
      if (is404Error(e)) {
        return null
      }

      throw e
    }
  }

  async getGuildMemberAvatarUrl(guildId: string, userId: string) {
    const member = await this.getGuildMember(guildId, userId)

    if (!member) {
      return null
    }

    return await member.user.displayAvatarURL({
      format: 'png',
    })
  }
}
