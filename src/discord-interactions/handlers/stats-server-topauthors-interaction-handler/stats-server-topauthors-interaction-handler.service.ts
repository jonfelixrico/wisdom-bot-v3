import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import { MessageEmbedOptions } from 'discord.js'
import { DiscordInteractionEvent } from 'src/discord-interactions/types/discord-interaction.event'
import { sprintf } from 'sprintf-js'
import { Logger } from '@nestjs/common'
import {
  GuildTopReceivedAuthorsQuery,
  IGuildTopReceivedAuthorsQueryOutput,
} from 'src/stats-model/queries/query-classes/guild-top-received-authors.query'

@EventsHandler(DiscordInteractionEvent)
export class StatsServerTopauthorsInteractionHandlerService
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
      options.getSubcommand() !== 'topauthors'
    ) {
      return
    }

    await interaction.deferReply()

    const topContributors: IGuildTopReceivedAuthorsQueryOutput =
      await this.queryBus.execute(
        new GuildTopReceivedAuthorsQuery({
          guildId: interaction.guildId,
          limit: 10,
        }),
      )

    const { guild } = interaction

    const embed: MessageEmbedOptions = {
      author: {
        name: 'Top Authors',
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
      sprintf('Top 10 authors for %s', guild.name),
      '',
      ...topContributors.map((author, index) =>
        sprintf(
          '%d. <@%s> (**%d**)',
          index + 1,
          author.authorId,
          author.receives,
        ),
      ),
    ].join('\n')

    embed.footer = {
      text: 'Ranking is based on the number of times their quotes were received (/receive)',
    }

    await interaction.editReply({
      embeds: [embed],
    })

    this.logger.verbose(
      sprintf('Processed interaction for %s', interaction.user.id),
      StatsServerTopauthorsInteractionHandlerService.name,
    )
  }
}
