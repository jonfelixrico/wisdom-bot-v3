import { Injectable } from '@nestjs/common'
import { Message, User } from 'discord.js'
import {
  CommandInfo,
  CommandoClient,
  CommandoMessage,
} from 'discord.js-commando'
import { filter, take } from 'rxjs/operators'
import { QuoteRepository } from 'src/classes/quote-repository.abstract'
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
    private quoteRepo: QuoteRepository,
    private reactionListener: ReactionListenerService,
    private deleteListener: DeleteListenerService,
  ) {
    super(client, COMMAND_INFO)
  }

  async run(
    message: CommandoMessage,
    { quote, author }: ISubmitCommandArgs,
  ): Promise<Message | Message[]> {
    const response = await message.channel.send('Teka wait lang ha.')

    const newQuote = await this.quoteRepo.createQuote({
      authorId: author.id,
      submitterId: author.id,
      channelId: message.channel.id,
      content: quote,
      messageId: response.id,
      guildId: message.guild.id,
    })

    this.watchQuoteForApproval(newQuote.quoteId, response)
    await response.react('🤔')
    return await response.edit(JSON.stringify(newQuote))
  }

  private watchQuoteForApproval(quoteId: string, message: Message) {
    const expireDt = new Date()
    expireDt.setMinutes(expireDt.getMinutes() + 2)

    this.reactionListener.watch(message.id, '🤔', 1, expireDt)
    this.deleteListener.watch(message.id)
  }
}
