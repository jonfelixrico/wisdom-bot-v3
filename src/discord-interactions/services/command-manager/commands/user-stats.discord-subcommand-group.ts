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
        .setName('topauthoredquotes')
        .setDescription('Get the top 10 quotes authored by a user')
        .addUserOption(userOptionFn),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('topcontributors')
        .setDescription('Lists down the top contributors for an author.')
        .addUserOption((option) =>
          option
            .setName('author')
            .setDescription(
              'The target author. If none was provided, your top contributors will be displayed instead.',
            ),
        ),
    )
