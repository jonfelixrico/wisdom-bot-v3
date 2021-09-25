import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import { MessageEmbedOptions } from 'discord.js'
import { DiscordInteractionEvent } from 'src/discord-interactions/types/discord-interaction.event'
import { sprintf } from 'sprintf-js'
import { Logger } from '@nestjs/common'
import {
  UserTopContributorsQuery,
  IUserTopContributorsQueryOutput,
} from 'src/stats-model/queries/query-classes/user-top-contributors.query'

@EventsHandler(DiscordInteractionEvent)
export class StatsUserTopcontributorsInteractionHandlerService
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
      options.getSubcommand() !== 'topcontributors'
    ) {
      return
    }

    const targetUser = options.getUser('user') || interaction.user

    await interaction.deferReply()

    const topQuotes: IUserTopContributorsQueryOutput =
      await this.queryBus.execute(
        new UserTopContributorsQuery({
          userId: targetUser.id,
          guildId: interaction.guildId,
          limit: 10,
        }),
      )

    const embed: MessageEmbedOptions = {
      author: {
        name: 'Top Contributors',
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
      sprintf('Top contributors for %s', targetUser),
      '',
      ...topQuotes.map(({ contributions, userId }, index) =>
        sprintf('%d. <@%s> (**%d**)', index + 1, userId, contributions),
      ),
    ].join('\n')

    await interaction.editReply({
      embeds: [embed],
    })

    this.logger.verbose(
      sprintf('Processed interaction for %s', interaction.user.id),
      StatsUserTopcontributorsInteractionHandlerService.name,
    )
  }
}
