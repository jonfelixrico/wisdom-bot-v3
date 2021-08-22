import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import { MessageEmbedOptions } from 'discord.js'
import { DiscordInteractionEvent } from 'src/discord-interactions/types/discord-interaction.event'
import { sprintf } from 'sprintf-js'
import { Logger } from '@nestjs/common'
import {
  GuildTopReceiversQuery,
  IGuildTopReceiversQueryOutput,
} from 'src/stats-model/queries/guild-top-receivers.query'

@EventsHandler(DiscordInteractionEvent)
export class ServerStatsTopreceiversInteractionHandlerService
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
      options.getSubcommand() !== 'topreceivers'
    ) {
      return
    }

    await interaction.deferReply()

    const topReceivers: IGuildTopReceiversQueryOutput =
      await this.queryBus.execute(
        new GuildTopReceiversQuery({
          guildId: interaction.guildId,
          limit: 10,
        }),
      )

    const { guild } = interaction

    const embed: MessageEmbedOptions = {
      author: {
        name: 'Top Receivers',
        icon_url: await interaction.user.displayAvatarURL({ format: 'png' }),
      },

      thumbnail: {
        url: guild.iconURL({ format: 'png' }),
      },
    }

    if (!topReceivers.length) {
      embed.description = 'No quote has been received yet.'
      await interaction.editReply({
        embeds: [embed],
      })
      return
    }

    embed.description = [
      sprintf('Top 10 receivers for %s', guild.name),
      '',
      ...topReceivers.map((receivers, index) =>
        sprintf(
          '%d. <@%s> (**%d**)',
          index + 1,
          receivers.userId,
          receivers.receives,
        ),
      ),
    ].join('\n')

    embed.footer = {
      text: 'Ranking is based on the number of quotes received (/receive)',
    }

    await interaction.editReply({
      embeds: [embed],
    })

    this.logger.verbose(
      sprintf(
        'Processed server stats topreceivers call invoked by by %s',
        interaction.user.id,
      ),
      ServerStatsTopreceiversInteractionHandlerService.name,
    )
  }
}
