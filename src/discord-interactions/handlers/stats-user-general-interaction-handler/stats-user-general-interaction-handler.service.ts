import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import { MessageEmbedOptions } from 'discord.js'
import { DiscordInteractionEvent } from 'src/discord-interactions/types/discord-interaction.event'
import { sprintf } from 'sprintf-js'
import { Logger } from '@nestjs/common'
import {
  IUserStatsQueryOutput,
  UserStatsQuery,
} from 'src/stats-model/queries/user-stats.query'

@EventsHandler(DiscordInteractionEvent)
export class StatsUserGeneralInteractionHandlerService
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
      options.getSubcommand() !== 'general'
    ) {
      return
    }

    const targetUser = options.getUser('user') || interaction.user

    await interaction.deferReply()

    const embed: MessageEmbedOptions = {
      author: {
        name: 'General Stats',
        icon_url: await interaction.user.displayAvatarURL({ format: 'png' }),
      },

      thumbnail: {
        url: await targetUser.displayAvatarURL({ format: 'png' }),
      },
    }

    const stats: IUserStatsQueryOutput = await this.queryBus.execute(
      new UserStatsQuery({
        userId: targetUser.id,
        guildId: interaction.guildId,
      }),
    )

    embed.description = [
      `General stats for ${targetUser}`,
      '',
      sprintf('**%d** quotes submitted', stats.submissions),
      sprintf('**%d** quotes received', stats.receives),
    ].join('\n')

    await interaction.editReply({
      embeds: [embed],
    })

    this.logger.verbose(
      sprintf('Processed interaction for %s', interaction.user.id),
      StatsUserGeneralInteractionHandlerService.name,
    )
  }
}
