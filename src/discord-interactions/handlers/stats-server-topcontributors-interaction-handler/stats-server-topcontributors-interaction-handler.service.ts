import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import { MessageEmbedOptions } from 'discord.js'
import { DiscordInteractionEvent } from 'src/discord-interactions/types/discord-interaction.event'
import { sprintf } from 'sprintf-js'
import { Logger } from '@nestjs/common'
import {
  GuildTopContributorsQuery,
  IGuildTopContributorsQueryOutput,
} from 'src/stats-model/queries/guild-top-contributors.query'

@EventsHandler(DiscordInteractionEvent)
export class StatsServerTopcontributorsInteractionHandlerService
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
      options.getSubcommand() !== 'topcontributors'
    ) {
      return
    }

    await interaction.deferReply()

    const topContributors: IGuildTopContributorsQueryOutput =
      await this.queryBus.execute(
        new GuildTopContributorsQuery({
          guildId: interaction.guildId,
          limit: 10,
        }),
      )

    const { guild } = interaction

    const embed: MessageEmbedOptions = {
      author: {
        name: 'Top Contributors',
        icon_url: await interaction.user.displayAvatarURL({ format: 'png' }),
      },

      thumbnail: {
        url: guild.iconURL({ format: 'png' }),
      },
    }

    if (!topContributors.length) {
      embed.description = 'No contributions made to the server yet.'
      await interaction.editReply({
        embeds: [embed],
      })
      return
    }

    embed.description = [
      sprintf('Top 10 contributors for %s', guild.name),
      '',
      ...topContributors.map((contributor, index) =>
        sprintf(
          '%d. <@%s> (**%d**)',
          index + 1,
          contributor.userId,
          contributor.contributions,
        ),
      ),
    ].join('\n')

    embed.footer = {
      text: 'Ranking is based on the number of quote submissions (/submit)',
    }

    await interaction.editReply({
      embeds: [embed],
    })

    this.logger.verbose(
      sprintf('Processed interaction for %s', interaction.user.id),
      StatsServerTopcontributorsInteractionHandlerService.name,
    )
  }
}
