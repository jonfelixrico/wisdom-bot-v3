import { SlashCommandSubcommandGroupBuilder } from '@discordjs/builders'

export const SERVER_STATS_SUBCOMMAND_GROUP =
  new SlashCommandSubcommandGroupBuilder()
    .setName('server')
    .setDescription('Get the stats of the server')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('general')
        .setDescription('Get the general stats of the server'),
    )
