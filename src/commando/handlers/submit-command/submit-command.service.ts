import { Injectable } from '@nestjs/common'
import { Message, User } from 'discord.js'
import { CommandoClient, CommandoMessage } from 'discord.js-commando'
import { IArgumentMap, WrappedCommand } from '../wrapped-command.class'
import { CommandBus } from '@nestjs/cqrs'
import { SUBMIT_COMMAND_INFO } from './submit-command-info'
import { SubmitQuoteCommand } from 'src/domain/commands/submit-quote.command'

interface ISubmitCommandArgs extends IArgumentMap {
  author: User
  quote: string
}

@Injectable()
export class SubmitCommandService extends WrappedCommand<ISubmitCommandArgs> {
  constructor(client: CommandoClient, private commandBus: CommandBus) {
    super(client, SUBMIT_COMMAND_INFO)
  }

  async run(
    message: CommandoMessage,
    { quote, author }: ISubmitCommandArgs,
  ): Promise<Message | Message[]> {
    const guildId = message.guild.id
    const channelId = message.channel.id
    const submitter = message.author

    const response = await message.channel.send('Processing submission...')

    await this.commandBus.execute(
      new SubmitQuoteCommand({
        authorId: author.id,
        submitterId: submitter.id,
        channelId,
        messageId: response.id,
        content: quote,
        guildId,
      }),
    )

    return response
  }
}
