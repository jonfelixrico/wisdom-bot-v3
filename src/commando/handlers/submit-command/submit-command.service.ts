import { Injectable } from '@nestjs/common'
import { Message, MessageEmbed, User } from 'discord.js'
import { CommandoClient, CommandoMessage } from 'discord.js-commando'
import { IArgumentMap, WrappedCommand } from '../wrapped-command.class'
import { CommandBus } from '@nestjs/cqrs'
import { SUBMIT_COMMAND_INFO } from './submit-command-info'
import { SubmitQuoteCommand } from 'src/domain/commands/submit-quote.command'
import { submitResponseMessageFormatter } from './../../utils/submit-response-message-formatter.util'

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

    const submitDt = new Date()

    const embed = submitResponseMessageFormatter({
      content: quote,
      submitterId: submitter.id,
      submitterAvatarUrl: await submitter.displayAvatarURL({
        format: 'png',
      }),
      authorId: author.id,
      authorAvatarUrl: await author.displayAvatarURL({ format: 'png' }),
      expireDt,
      reactionCount: approveCount + 1,
      reactionEmoji: approveEmoji,
      submitDt,
    })

    const response = await message.channel.send(new MessageEmbed(embed))
    const messageId = response.id

    await this.commandBus.execute(
      new SubmitQuoteCommand({
        authorId: author.id,
        submitterId: submitter.id,
        channelId,
        content: quote,
        messageId,
        guildId,
        expireDt,
        upvoteCount: approveCount,
        upvoteEmoji: approveEmoji,
        // TODO might have to remove this since submitDt should be encapsulated within the entity
        // business rules state that we shouldn't be able to set the submitDt of the quote
        submitDt,
      }),
    )

    await response.react(approveEmoji)
    return response
  }
}
