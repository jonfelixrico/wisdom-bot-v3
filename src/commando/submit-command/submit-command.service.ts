import { Injectable } from '@nestjs/common'
import { Message, User } from 'discord.js'
import { CommandoClient, CommandoMessage } from 'discord.js-commando'
import { IArgumentMap, WrappedCommand } from '../wrapped-command.class'
import { CommandBus } from '@nestjs/cqrs'
import { ReactionListenerService } from '../reaction-listener/reaction-listener.service'
import { DeleteListenerService } from '../delete-listener/delete-listener.service'
import { SUBMIT_COMMAND_INFO } from './submit-command-info'
import { SubmitQuoteCommand } from 'src/domain/commands/submit-quote.command'

interface ISubmitCommandArgs extends IArgumentMap {
  author: User
  quote: string
}

@Injectable()
export class SubmitCommandService extends WrappedCommand<ISubmitCommandArgs> {
  constructor(
    client: CommandoClient,
    private commandBus: CommandBus,
    private reactionListener: ReactionListenerService,
    private deleteListener: DeleteListenerService,
  ) {
    super(client, SUBMIT_COMMAND_INFO)
  }

  async run(
    message: CommandoMessage,
    { quote, author }: ISubmitCommandArgs,
  ): Promise<Message | Message[]> {
    const guildId = message.guild.id
    const channelId = message.channel.id
    const submitterId = message.author.id

    const expireMillis = 60 * 1000 * 2
    const approveEmoji = '🤔'
    const approveCount = 1

    const expireDt = new Date(Date.now() + expireMillis)

    const quoteLine = `**"${quote}"** - ${author}, ${new Date().getFullYear()}`
    const instructionsLine = `_This submission needs ${
      approveCount + 1
    } ${approveEmoji} reacts to get reactions on or before *${expireDt}*._`

    const response = await message.channel.send('🤔')
    const messageId = response.id
    await response.edit([quoteLine, instructionsLine].join('\n'))

    await this.commandBus.execute(
      new SubmitQuoteCommand({
        authorId: author.id,
        submitterId,
        channelId,
        content: quote,
        messageId,
        guildId,
        expireDt,
        upvoteCount: approveCount,
        upvoteEmoji: approveEmoji,
        submitDt: new Date(),
      }),
    )

    await response.react(approveEmoji)
    return response
  }
}
