import { Inject, Injectable, Logger } from '@nestjs/common'
import { Message } from 'discord.js'
import {
  CommandInfo,
  CommandoClient,
  CommandoMessage,
} from 'discord.js-commando'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { ConcurRepository } from 'src/classes/concur-repository.abstract'
import { ReceiveRepository } from 'src/classes/receive-repository.abstract'
import { WrappedCommand } from '../wrapped-command.class'

const COMMAND_INFO: CommandInfo = {
  name: 'amen',
  aliases: ['concur', 'solid'],
  description: 'Agree to a receive.',
  memberName: 'concur',
  group: 'commands',
}

@Injectable()
export class ConcurCommandService extends WrappedCommand {
  constructor(
    client: CommandoClient,
    private recvRepo: ReceiveRepository,
    private concurRepo: ConcurRepository,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
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

    await message.react('👌')
  }
}
