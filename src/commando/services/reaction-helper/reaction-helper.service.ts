import { Injectable, Logger } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { Message } from 'discord.js'
import { ReactToReceiveCommand } from 'src/domain/commands/react-to-receive.command'
import { Receive } from 'src/domain/entities/receive.entity'
import { DomainErrorCodes } from 'src/domain/errors/domain-error-codes.enum'
import { DomainError } from 'src/domain/errors/domain-error.class'
import { UpdateReceiveMessageReactionsListCommand } from 'src/infrastructure/commands/update-receive-message-reactions-list.command'
import { ReceiveQueryService } from 'src/read-model-query/receive-query/receive-query.service'

@Injectable()
export class ReactionHelperService {
  constructor(
    private logger: Logger,
    private commandBus: CommandBus,
    private query: ReceiveQueryService,
  ) {}

  async handleReaction(message: Message, karma: number) {
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
      const receive: Receive = await this.commandBus.execute(
        new ReactToReceiveCommand({
          karma,
          receiveId,
          userId,
        }),
      )

      const { reactions } = receive

      this.commandBus.execute(
        new UpdateReceiveMessageReactionsListCommand({
          receiveId,
          reactions: {
            upvotes: reactions
              .filter(({ karma }) => karma > 0)
              .map(({ userId }) => userId)
              .sort(),
            downvotes: reactions
              .filter(({ karma }) => karma < 0)
              .map(({ userId }) => userId)
              .sort(),
          },
        }),
      )
    } catch (e) {
      if (
        e instanceof DomainError &&
        e.code === DomainErrorCodes.REACTION_DUPLICATE_USER
      ) {
        this.logger.log(
          `User ${userId} has already reacted to receive ${receiveId}.`,
          ReactionHelperService.name,
        )

        return message.channel.send(
          'You have already cast your reaction to this quote.',
        )
      }

      // the dupe user reaction is the only error we'll handle. for the rest, they are uncaught exceptions
      throw e
    }

    await message.react('👌')

    return message
  }
}
