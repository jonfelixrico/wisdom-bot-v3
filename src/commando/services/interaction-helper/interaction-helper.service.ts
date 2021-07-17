import { Injectable, Logger } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { Message } from 'discord.js'
import { InteractReceiveCommand } from 'src/domain/commands/interact-receive.command'
import { DomainErrorCodes } from 'src/domain/errors/domain-error-codes.enum'
import { DomainError } from 'src/domain/errors/domain-error.class'
import { ReceiveQueryService } from 'src/read-repositories/queries/receive-query/receive-query.service'

@Injectable()
export class InteractionHelperService {
  constructor(
    private logger: Logger,
    private commandBus: CommandBus,
    private query: ReceiveQueryService,
  ) {}

  async handleInteraction(message: Message, karma: number) {
    const { channel, reference } = message

    if (!reference) {
      return await channel.send('Please use this command only in replies.')
    }

    const receiveId = await this.query.getReceiveIdFromMessageId(
      reference.messageID,
    )

    if (!receiveId) {
      return await channel.send(
        "The message you're replying to must be a received quote.",
      )
    }

    const { id: userId } = message.author

    try {
      await this.commandBus.execute(
        new InteractReceiveCommand({
          karma,
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
          `User ${userId} has already reacted to receive ${receiveId}.`,
          InteractionHelperService.name,
        )

        return message.channel.send(
          'You have already cast your reaction to this quote.',
        )
      }

      // the dupe user interact is the only error we'll handle. for the rest, they are uncaught exceptions
      throw e
    }

    await message.react('👌')
    return message
  }
}
