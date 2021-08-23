import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import { MessageEmbedOptions } from 'discord.js'
import { DiscordInteractionEvent } from 'src/discord-interactions/types/discord-interaction.event'
import { sprintf } from 'sprintf-js'
import { Logger } from '@nestjs/common'
import {
  UserTopReceiversQuery,
  IUserTopReceiversQueryOutput,
} from 'src/stats-model/queries/user-top-receivers.query'
import { SPACE_CHARACTER } from 'src/types/discord.constants'

@EventsHandler(DiscordInteractionEvent)
export class StatsUserTopreceiversInteractionHandlerService
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
      options.getSubcommand() !== 'topreceivers'
    ) {
      return
    }

    const targetUser = options.getUser('user') || interaction.user

    await interaction.deferReply()

    const topQuotes: IUserTopReceiversQueryOutput = await this.queryBus.execute(
      new UserTopReceiversQuery({
        authorId: targetUser.id,
        guildId: interaction.guildId,
        limit: 10,
      }),
    )

    const embed: MessageEmbedOptions = {
      author: {
        name: 'Top Receivers',
        icon_url: await interaction.user.displayAvatarURL({ format: 'png' }),
      },

      thumbnail: {
        url: await targetUser.displayAvatarURL({ format: 'png' }),
      },
    }

    if (!topQuotes.length) {
      embed.description = sprintf(
        `%s has not authored any quotes or has no quotes with any receives yet.`,
        targetUser,
      )
      await interaction.editReply({
        embeds: [embed],
      })
      return
    }

    embed.description = [
      sprintf('Top 10 receivers for the quotes authored by %s', targetUser),
      SPACE_CHARACTER,

      ...topQuotes.map(({ receives, userId }, index) =>
        sprintf('%d. <@%s> (**%d**)', index + 1, userId, receives),
      ),

      SPACE_CHARACTER,
      sprintf(
        '_Ranking is based from the number of times a user has received a quote authored by %s_',
        targetUser,
      ),
    ].join('\n')

    await interaction.editReply({
      embeds: [embed],
    })

    this.logger.verbose(
      sprintf('Processed interaction for %s', interaction.user.id),
      StatsUserTopreceiversInteractionHandlerService.name,
    )
  }
}
