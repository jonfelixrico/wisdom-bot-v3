import { CommandInfo } from 'discord.js-commando'

export const SUBMIT_COMMAND_INFO: CommandInfo = {
  name: 'submit',
  aliases: ['add'],
  group: 'commands',
  memberName: 'submit',
  description:
    'Submit a new quote. This quote has to go through an approval process.',
  args: [
    {
      key: 'author',
      type: 'user',
      prompt: '',
    },
    {
      key: 'quote',
      type: 'string',
      prompt: '',
    },
  ],
  argsPromptLimit: 0,
}
