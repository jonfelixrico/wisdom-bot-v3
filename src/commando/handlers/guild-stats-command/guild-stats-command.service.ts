import { Injectable } from '@nestjs/common'
import { Message, MessageEmbed, MessageEmbedOptions } from 'discord.js'
import {
  CommandoMessage,
  CommandoClient,
  CommandInfo,
} from 'discord.js-commando'
import { GuildStatsQueryService } from 'src/read-model-query/guild-stats-query/guild-stats-query.service'
import { WrappedCommand } from '../wrapped-command.class'

const COMMAND_INFO: CommandInfo = {
  name: 'server',
  group: 'commands',
  memberName: 'server-stats',
  description: 'Show the stats of the server.',
  argsPromptLimit: 0,
  args: [
    {
      key: 'user',
      type: 'user',
      prompt: '',
      default: () => null,
    },
  ],
  guildOnly: true,
}

@Injectable()
export class GuildStatsCommandService extends WrappedCommand {
  constructor(client: CommandoClient, private query: GuildStatsQueryService) {
    super(client, COMMAND_INFO)
  }

  async run({ guild, channel }: CommandoMessage): Promise<Message | Message[]> {
    const { reactions, quotes, receives } = await this.query.getStats(guild.id)

    const embed: MessageEmbedOptions = {
      author: {
        name: `Wisdom stats for ${guild.name}`,
        icon_url: guild.iconURL({ format: 'png' }),
      },
      description: [
        '', // padding
        `**${quotes}** ${quotes === 1 ? 'quote' : 'quotes'} submitted`,
        `**${receives}** ${receives === 1 ? 'quote' : 'quotes'} received`,
        `**${reactions}** ${
          reactions === 1 ? 'reaction' : 'reactions'
        } to quotes`,
      ].join('\n'),
    }

    return await channel.send(new MessageEmbed(embed))
  }
}
