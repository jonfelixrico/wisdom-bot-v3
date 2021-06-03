import { Injectable } from '@nestjs/common'
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

    // TODO implement actual response
    const response = await message.channel.send(JSON.stringify(quote))

    await this.pendingRepo.createPendingQuote({
      authorId: author.id,
      submitterId: author.id,
      channelId: message.channel.id,
      content: quote,
      messageId: response.id,
      guildId,
      expireDt,
      approvalCount: approveCount,
      approvalEmoji: approveEmoji,
    })

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
