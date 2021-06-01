import { Injectable } from '@nestjs/common'
import { Message } from 'discord.js'
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'

@Injectable()
export class SubmitCommandService extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'submit',
      aliases: ['add'],
      group: 'commands',
      memberName: 'submit',
      description:
        'Submit a new quote. This quote has to go through an approval process.',
      args: [
        {
          key: 'quote',
          type: 'string',
          prompt: 'Test prompt',
        },
        {
          key: 'author',
          type: 'user',
          prompt: 'Test prompt 2',
        },
      ],
      argsPromptLimit: 0,
    })

    client.registry.registerCommand(this)
  }

  public async run(message: CommandoMessage): Promise<Message | Message[]> {
    return await message.channel.send('hi!')
  }
}
