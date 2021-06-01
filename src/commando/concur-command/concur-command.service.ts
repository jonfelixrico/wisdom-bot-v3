import { Injectable } from '@nestjs/common'
import { Message } from 'discord.js'
import {
  CommandInfo,
  CommandoClient,
  CommandoMessage,
} from 'discord.js-commando'
import { ConcurRepository } from 'src/classes/concur-repository.abstract'
import { ReceiveRepository } from 'src/classes/receive-repository.abstract'
import { WrappedCommand } from '../wrapped-command.class'

const COMMAND_INFO: CommandInfo = {
  name: 'concur',
  aliases: ['amen'],
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
  ) {
    super(client, COMMAND_INFO)
  }

  async run({
    channel,
    reference,
    author,
    guild,
  }: CommandoMessage): Promise<Message | Message[]> {
    if (!reference) {
      return await channel.send('Invalid invocation.')
    }

    const receive = await this.recvRepo.findReceiveByMessageId(
      reference.messageID,
    )

    if (!receive) {
      return await channel.send('Invalid invocation.')
    }

    const [concur, concurCount] = await this.concurRepo.createConcur({
      channelId: channel.id,
      // TODO remove guild and channel information
      guildId: guild.id,
      userId: author.id,
      receiveId: receive.receiveId,
    })

    return await channel.send([JSON.stringify(concur), concurCount].join('/'))
  }
}
