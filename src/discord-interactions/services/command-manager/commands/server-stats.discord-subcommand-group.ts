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
    .addSubcommand((subcommand) =>
      subcommand
        .setName('topcontributors')
        .setDescription('Get the top 10 contributors in the server'),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('topauthors')
        .setDescription('Get the top 10 authors in the server'),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('topquotes')
        .setDescription('Get the top 10 quotes in the server'),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('topreceivers')
        .setDescription('Get the top 10 receivers in the server'),
    )
