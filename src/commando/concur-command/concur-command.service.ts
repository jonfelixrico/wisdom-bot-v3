import { Inject, Injectable, Logger } from '@nestjs/common'
import { Message } from 'discord.js'
import {
  CommandInfo,
  CommandoClient,
  CommandoMessage,
} from 'discord.js-commando'
import { sprintf } from 'sprintf-js'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { ConcurRepository } from 'src/classes/concur-repository.abstract'
import { IQuote, QuoteRepository } from 'src/classes/quote-repository.abstract'
import {
  IReceive,
  ReceiveRepository,
} from 'src/classes/receive-repository.abstract'
import { GuildRepoService } from 'src/discord/guild-repo/guild-repo.service'
import { WrappedCommand } from '../wrapped-command.class'

const COMMAND_INFO: CommandInfo = {
  name: 'amen',
  aliases: ['concur', 'solid'],
  description: 'Agree to a receive.',
  memberName: 'concur',
  group: 'commands',
}

function generateResponseString(
  { content, authorId, submitDt }: IQuote,
  concurs: number,
) {
  return [
    sprintf('**"%s"** - <@%s>, %d', content, authorId, submitDt.getFullYear()),
    sprintf('**Upvotes:** %d', concurs),
  ].join('\n')
}

@Injectable()
export class ConcurCommandService extends WrappedCommand {
  constructor(
    client: CommandoClient,
    private recvRepo: ReceiveRepository,
    private concurRepo: ConcurRepository,
    private quoteRepo: QuoteRepository,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
    private discordGuildRepo: GuildRepoService,
  ) {
    super(client, COMMAND_INFO)
  }

  async run(message: CommandoMessage): Promise<Message | Message[]> {
    const { channel, reference, author, guild } = message

    if (!reference) {
      return await channel.send('Invalid invocation.')
    }

    const receive = await this.recvRepo.findReceiveByMessageId(
      reference.messageID,
    )

    if (!receive) {
      return await channel.send('Invalid invocation.')
    }

    const concurs = await this.concurRepo.findConcursByReceiveId(
      receive.receiveId,
    )

    const hasUserConcurred = concurs.some(({ userId }) => author.id === userId)
    if (hasUserConcurred) {
      this.logger.warn(
        `User ${author.id} has already concurred quote ${receive.quoteId}`,
        ConcurCommandService.name,
      )

      message.reply('you have already upvoted this quote.')
      return
    }

    const [concur] = await this.concurRepo.createConcur({
      channelId: channel.id,
      // TODO remove guild and channel information
      guildId: guild.id,
      userId: author.id,
      receiveId: receive.receiveId,
    })

    this.logger.log(
      `Created concur ${concur.concurId} for receive ${receive.receiveId}.`,
      ConcurCommandService.name,
    )

    await this.updateReceiveMessage(receive, concurs.length + 1)
    await message.react('👌')
  }

  private async updateReceiveMessage(
    { channelId, guildId, messageId, quoteId }: IReceive,
    concurCount: number,
  ) {
    const quote = await this.quoteRepo.getQuote(quoteId)

    if (!quote) {
      this.logger.error(
        `Quote ${quoteId} not found while trying to concur.`,
        ConcurCommandService.name,
      )
      return
    }

    const channel = await this.discordGuildRepo.getTextChannel(
      guildId,
      channelId,
    )

    if (!channel) {
      this.logger.error(
        `Channel ${channelId} not found while trying to update concur message.`,
        ConcurCommandService.name,
      )
      return
    }

    const { messages } = channel
    const message = await messages.fetch(messageId)

    if (!message) {
      this.logger.error(
        `Message ${messageId} not found while trying to concur.`,
        ConcurCommandService.name,
      )
      return
    }

    await message.edit(generateResponseString(quote, concurCount))
  }
}
