import { SlashCommandSubcommandGroupBuilder } from '@discordjs/builders'

export const USER_STATS_SUBCOMMAND_GROUP =
  new SlashCommandSubcommandGroupBuilder()
    .setName('user')
    .setDescription('Get the stats of users')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('topauthoredquotes')
        .setDescription('Show the top authored quotes of a user')
        .addUserOption((option) =>
          option
            .setName('user')
            .setDescription(
              'The user to get to have their top authored quotes shown',
            ),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('topcontributors')
        .setDescription('Show the top contributors (submitters) of a user')
        .addUserOption((option) =>
          option
            .setName('user')
            .setDescription('The user to have their top contributors shown'),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('topreceivers')
        .setDescription('Show the top receivers of a user')
        .addUserOption((option) =>
          option
            .setName('user')
            .setDescription('The user to have their top receivers shown'),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('general')
        .setDescription('Show the general stats of a user')
        .addUserOption((option) =>
          option
            .setName('user')
            .setDescription('The user to have their stats shown'),
        ),
    )
