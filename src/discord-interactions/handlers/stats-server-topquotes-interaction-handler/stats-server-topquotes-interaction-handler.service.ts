import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import { MessageEmbedOptions, Util } from 'discord.js'
import { DiscordInteractionEvent } from 'src/discord-interactions/types/discord-interaction.event'
import { sprintf } from 'sprintf-js'
import { Logger } from '@nestjs/common'
import {
  GuildTopReceivedQuotesQuery,
  IGuildTopReceivedQuotesQueryOutput,
} from 'src/stats-model/queries/query-classes/guild-top-received-quotes.query'

@EventsHandler(DiscordInteractionEvent)
export class StatsServerTopquotesInteractionHandlerService
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
      options.getSubcommand() !== 'topquotes'
    ) {
      return
    }

    await interaction.deferReply()

    const topQuotes: IGuildTopReceivedQuotesQueryOutput =
      await this.queryBus.execute(
        new GuildTopReceivedQuotesQuery({
          guildId: interaction.guildId,
          limit: 10,
        }),
      )

    const { guild } = interaction

    const embed: MessageEmbedOptions = {
      author: {
        name: 'Top Quotes',
        icon_url: await interaction.user.displayAvatarURL({ format: 'png' }),
      },

      thumbnail: {
        url: guild.iconURL({ format: 'png' }),
      },
    }

    if (!topQuotes.length) {
      embed.description = 'No quotes received yet.'
      await interaction.editReply({
        embeds: [embed],
      })
      return
    }

    embed.description = [
      sprintf('Top 10 quotes for %s', guild.name),
      '',
      ...topQuotes.map(({ receives, authorId, content }, index) =>
        sprintf(
          '%d. _"%s"_\n- <@%s> (**%d**)',
          index + 1,
          Util.escapeMarkdown(content),
          authorId,
          receives,
        ),
      ),
    ].join('\n')

    embed.footer = {
      text: 'Ranking is based on the number of times the quotes were received (/receive)',
    }

    await interaction.editReply({
      embeds: [embed],
    })

    this.logger.verbose(
      sprintf('Processed interaction for %s', interaction.user.id),
      StatsServerTopquotesInteractionHandlerService.name,
    )
  }
}
