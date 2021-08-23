import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import { MessageEmbedOptions } from 'discord.js'
import { DiscordInteractionEvent } from 'src/discord-interactions/types/discord-interaction.event'
import {
  GuildStatsQuery,
  IGuildStatsQueryOutput,
} from 'src/stats-model/queries/guild-stats.query'
import { sprintf } from 'sprintf-js'
import { Logger } from '@nestjs/common'

@EventsHandler(DiscordInteractionEvent)
export class StatsServerGeneralInteractionHandlerService
  implements IEventHandler<DiscordInteractionEvent>
{
  constructor(private queryBus: QueryBus, private logger: Logger) {}

  async handle({ interaction }: DiscordInteractionEvent) {
    if (!interaction.isCommand() || interaction.commandName !== 'stats') {
      return
    }

    const { options } = interaction

    if (
      options.getSubcommandGroup() !== 'server' ||
      options.getSubcommand() !== 'general'
    ) {
      return
    }

    await interaction.deferReply()
    const guildStats: IGuildStatsQueryOutput = await this.queryBus.execute(
      new GuildStatsQuery({ guildId: interaction.guildId }),
    )

    const { guild } = interaction

    const embed: MessageEmbedOptions = {
      author: {
        name: 'General Stats',
        icon_url: await interaction.user.displayAvatarURL({ format: 'png' }),
      },

      thumbnail: {
        url: guild.iconURL({ format: 'png' }),
      },

      description: [
        `General stats for ${guild}`,
        '',
        sprintf('**%d** quotes submitted', guildStats.submissions),
        sprintf('**%d** quotes received', guildStats.receives),
        sprintf('**%d** unique users', guildStats.userCount),
      ].join('\n'),
    }

    await interaction.editReply({
      embeds: [embed],
    })

    this.logger.verbose(
      sprintf('Processed interaction for %s', interaction.user.id),
      StatsServerGeneralInteractionHandlerService.name,
    )
  }
}
