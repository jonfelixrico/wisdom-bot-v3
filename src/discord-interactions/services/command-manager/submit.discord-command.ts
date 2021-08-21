import { SlashCommandBuilder } from '@discordjs/builders'

export const SUBMIT_COMMAND = new SlashCommandBuilder()
  .setName('submit')
  .setDescription('Submit a quote.')
  .addUserOption((option) =>
    option
      .setName('author')
      .setDescription('The author of the quote.')
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('quote')
      .setDescription('The content of the quote.')
      .setRequired(true),
  )
