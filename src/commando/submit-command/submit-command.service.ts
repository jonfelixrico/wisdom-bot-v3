import { Inject, Injectable, Logger } from '@nestjs/common'
import { Message, User } from 'discord.js'
import {
  CommandInfo,
  CommandoClient,
  CommandoMessage,
} from 'discord.js-commando'
import { GuildRepository } from 'src/classes/guild-repository.abstract'
import { IArgumentMap, WrappedCommand } from '../wrapped-command.class'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { CommandBus } from '@nestjs/cqrs'
import { SubmitQuoteCommand } from 'src/domain/pending-quote/submit-quote.command'

const COMMAND_INFO: CommandInfo = {
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

interface ISubmitCommandArgs extends IArgumentMap {
  author: User
  quote: string
}

@Injectable()
export class SubmitCommandService extends WrappedCommand<ISubmitCommandArgs> {
  constructor(
    client: CommandoClient,
    private guildRepo: GuildRepository,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
    private commandBus: CommandBus,
  ) {
    super(client, COMMAND_INFO)
  }

  async run(
    message: CommandoMessage,
    { quote, author }: ISubmitCommandArgs,
  ): Promise<Message | Message[]> {
    const guildId = message.guild.id
    const channelId = message.channel.id
    const submitterId = message.author.id

    const { expireMillis, approveEmoji, approveCount } =
      await this.guildRepo.getQuoteSettings(guildId)

    const expireDt = new Date(Date.now() + expireMillis)

    const response = await message.channel.send('Loading...')

    const command = new SubmitQuoteCommand({
      authorId: author.id,
      channelId,
      content: quote,
      expireDt,
      guildId,
      messageId: response.id,
      submitDt: new Date(),
      submitterId,
      upvoteCount: approveCount,
      upvoteEmoji: approveEmoji,
    })

    await this.commandBus.execute(command)

    this.logger.log(
      `User ${submitterId} submitted a quote in channel ${channelId} at guild ${guildId}.`,
      SubmitCommandService.name,
    )

    return response
  }
}
