import { Injectable } from '@nestjs/common'
import { Message, MessageEmbed, MessageEmbedOptions, User } from 'discord.js'
import { CommandoClient, CommandoMessage } from 'discord.js-commando'
import { IArgumentMap, WrappedCommand } from '../wrapped-command.class'
import { CommandBus } from '@nestjs/cqrs'
import { SUBMIT_COMMAND_INFO } from './submit-command-info'
import { SubmitQuoteCommand } from 'src/domain/commands/submit-quote.command'
import { SPACE_CHARACTER } from 'src/types/discord.constants'

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
    const submitterId = message.author.id

    // TODO pull these from a repository instead
    const expireMillis = 60 * 1000 * 2
    const approveEmoji = '🤔'
    const approveCount = 1

    const expireDt = new Date(Date.now() + expireMillis)
    const submitDt = new Date()

    const embed: MessageEmbedOptions = {
      title: 'Quote submitted!',
      description: [
        `**"${quote}"**`,
        `- ${author}, ${new Date().getFullYear()}`,
      ].join('\n'),
      fields: [
        {
          name: SPACE_CHARACTER,
          value: [
            `Submitted by ${message.author} on ${submitDt}`,
            `_This submission needs ${
              approveCount + 1
            } ${approveEmoji} reacts to get reactions on or before ${expireDt}._`,
          ].join('\n\n'),
        },
      ],
      thumbnail: {
        url: await author.displayAvatarURL({ format: 'png' }),
      },
      timestamp: submitDt,
    }

    const response = await message.channel.send('🤔')
    const messageId = response.id
    await response.edit(null, new MessageEmbed(embed))

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
        // TODO might have to remove this since submitDt should be encapsulated within the entity
        // business rules state that we shouldn't be able to set the submitDt of the quote
        submitDt,
      }),
    )

    await response.react(approveEmoji)
    return response
  }
}
