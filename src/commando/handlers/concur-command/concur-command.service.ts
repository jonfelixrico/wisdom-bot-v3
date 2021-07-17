import { Inject, Injectable, Logger } from '@nestjs/common'
import { Message } from 'discord.js'
import {
  CommandInfo,
  CommandoClient,
  CommandoMessage,
} from 'discord.js-commando'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { WrappedCommand } from '../wrapped-command.class'
import { ReceiveQueryService } from 'src/read-repositories/queries/receive-query/receive-query.service'
import { CommandBus } from '@nestjs/cqrs'
import { InteractReceiveCommand } from 'src/domain/commands/interact-receive.command'
import { DomainError } from 'src/domain/errors/domain-error.class'
import { DomainErrorCodes } from 'src/domain/errors/domain-error-codes.enum'

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
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
    private query: ReceiveQueryService,
    private commandBus: CommandBus,
  ) {
    super(client, COMMAND_INFO)
  }

  async run(message: CommandoMessage): Promise<Message | Message[]> {
    const { channel, reference } = message

    if (!reference) {
      return await channel.send('Invalid invocation.')
    }

    const receiveId = await this.query.getReceiveIdFromMessageId(
      reference.messageID,
    )

    if (!receiveId) {
      return await channel.send('Invalid invocation.')
    }

    const userId = message.author.id

    try {
      await this.commandBus.execute(
        new InteractReceiveCommand({
          // temporarily force all concurs as karma 1
          karma: 1,
          receiveId,
          userId,
        }),
      )
    } catch (e) {
      if (
        e instanceof DomainError &&
        e.code === DomainErrorCodes.INTERACTION_DUPLICATE_USER
      ) {
        this.logger.log(
          `User ${userId} has already interacted with receive ${receiveId}.`,
          ConcurCommandService.name,
        )

        return message.channel.send(
          'You have already interacted with this received quote.',
        )
      }

      // the dupe user interact is the only error we'll handle. for the rest, they are uncaught exceptions
      throw e
    }

    await message.react('👌')
  }
}
