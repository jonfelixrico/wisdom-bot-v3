import { Inject, Injectable, Logger } from '@nestjs/common'
import { Message, User } from 'discord.js'
import {
  CommandInfo,
  CommandoClient,
  CommandoMessage,
} from 'discord.js-commando'
import { GuildRepository } from 'src/classes/guild-repository.abstract'
import { PendingQuoteRepository } from 'src/classes/pending-quote-repository.abstract'
import { DeleteListenerService } from '../delete-listener/delete-listener.service'
import { ReactionListenerService } from '../reaction-listener/reaction-listener.service'
import { IArgumentMap, WrappedCommand } from '../wrapped-command.class'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'

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
    private pendingRepo: PendingQuoteRepository,
    private guildRepo: GuildRepository,
    private reactionListener: ReactionListenerService,
    private deleteListener: DeleteListenerService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {
    super(client, COMMAND_INFO)
  }

  async run(
    message: CommandoMessage,
    { quote, author }: ISubmitCommandArgs,
  ): Promise<Message | Message[]> {
    const guildId = message.guild.id
    const { expireMillis, approveEmoji, approveCount } =
      await this.guildRepo.getQuoteSettings(guildId)

    const expireDt = new Date(Date.now() + expireMillis)

    const quoteLine = `**"${quote}"** - ${author}, ${new Date().getFullYear()}`
    const instructionsLine = `_This submission needs ${
      approveCount + 1
    } ${approveEmoji} reacts to get reactions on or before *${expireDt}*._`

    const response = await message.channel.send('🤔')
    await response.edit([quoteLine, instructionsLine].join('\n'))

    const { quoteId } = await this.pendingRepo.createPendingQuote({
      authorId: author.id,
      submitterId: message.author.id,
      channelId: message.channel.id,
      content: quote,
      messageId: response.id,
      guildId,
      expireDt,
      approvalCount: approveCount,
      approvalEmoji: approveEmoji,
    })

    this.logger.log(
      `Created quote ${quoteId} in guild ${guildId}`,
      SubmitCommandService.name,
    )

    this.reactionListener.watch(
      response.id,
      approveEmoji,
      approveCount,
      expireDt,
    )
    this.deleteListener.watch(response.id)

    await response.react(approveEmoji)
    return response
  }
}
