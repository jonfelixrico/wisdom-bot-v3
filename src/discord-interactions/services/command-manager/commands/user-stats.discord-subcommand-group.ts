import {
  SlashCommandSubcommandGroupBuilder,
  SlashCommandUserOption,
} from '@discordjs/builders'

const userOptionFn = (option: SlashCommandUserOption) =>
  option
    .setName('user')
    .setDescription('The user to have their stats displayed')
    .setRequired(false)

export const USER_STATS_SUBCOMMAND_GROUP =
  new SlashCommandSubcommandGroupBuilder()
    .setName('user')
    .setDescription('Get the stats of users')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('general')
        .setDescription('Get the general stats of a user')
        .addUserOption(userOptionFn),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('topcontributors')
        .setDescription('Get the top 10 contributors for a user')
        .addUserOption(userOptionFn),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('topauthors')
        .setDescription('Get the top 10 authors of the user')
        .addUserOption(userOptionFn),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('topauthoredquotes')
        .setDescription('Get the top 10 quotes authored by a user')
        .addUserOption(userOptionFn),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('topreceivers')
        .setDescription('Get the top 10 receivers of the user')
        .addUserOption(userOptionFn),
    )
