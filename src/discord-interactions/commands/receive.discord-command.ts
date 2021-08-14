import { SlashCommandBuilder } from '@discordjs/builders'

export const receiveCommand = new SlashCommandBuilder()
  .setName('receive')
  .setDescription('Gives you a random quote.')
  .addUserOption(
    (option) =>
      option
        .setName('author')
        .setDescription(
          'You can filter the author of the random quote by providing a mention.',
        )
        .setRequired(false), // explicitly set this to false
  )
