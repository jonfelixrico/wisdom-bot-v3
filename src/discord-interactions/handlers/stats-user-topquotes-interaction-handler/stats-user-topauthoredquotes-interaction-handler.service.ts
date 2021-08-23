import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import { MessageEmbedOptions, Util } from 'discord.js'
import { DiscordInteractionEvent } from 'src/discord-interactions/types/discord-interaction.event'
import { sprintf } from 'sprintf-js'
import { Logger } from '@nestjs/common'
import {
  UserTopReceivedQuotesQuery,
  IUserTopReceivedQuotesQueryOutput,
} from 'src/stats-model/queries/user-top-received-quotes.query'

@EventsHandler(DiscordInteractionEvent)
export class StatsUserTopauthoredquotesInteractionHandlerService
  implements IEventHandler<DiscordInteractionEvent>
{
  constructor(private queryBus: QueryBus, private logger: Logger) {}

  async handle({ interaction }: DiscordInteractionEvent) {
    if (!interaction.isCommand() || interaction.commandName !== 'stats') {
      return
    }

    const { options } = interaction

    if (
      options.getSubcommandGroup() !== 'user' ||
      options.getSubcommand() !== 'topauthoredquotes'
    ) {
      return
    }

    const targetUser = options.getUser('user') || interaction.user

    await interaction.deferReply()

    const topQuotes: IUserTopReceivedQuotesQueryOutput =
      await this.queryBus.execute(
        new UserTopReceivedQuotesQuery({
          authorId: targetUser.id,
          guildId: interaction.guildId,
          limit: 10,
        }),
      )

    const embed: MessageEmbedOptions = {
      author: {
        name: 'Top Authored Quotes',
        icon_url: await interaction.user.displayAvatarURL({ format: 'png' }),
      },

      thumbnail: {
        url: await targetUser.displayAvatarURL({ format: 'png' }),
      },
    }

    if (!topQuotes.length) {
      embed.description = sprintf(
        `%s has not authored any quotes yet.`,
        targetUser,
      )
      await interaction.editReply({
        embeds: [embed],
      })
      return
    }

    embed.description = [
      sprintf('Top 10 quotes by %s', targetUser),
      '',
      ...topQuotes.map(({ receives, content }, index) =>
        sprintf(
          '%d. _"%s"_ (**%d**)',
          index + 1,
          Util.escapeMarkdown(content),
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
      sprintf(
        'Processed user stats topauthoredquotes call invoked by by %s',
        interaction.user.id,
      ),
      StatsUserTopauthoredquotesInteractionHandlerService.name,
    )
  }
}
