import { Inject, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Client, Message } from 'discord.js'
import { SuspendDeleteWatchCommand } from 'src/discord-message/suspend-delete-watch.command'
import { WrappedRedisClient } from 'src/discord-message/utils/wrapped-redis-client.class'
import { DISCORD_PROVIDER } from 'src/discord/discord.provider-token'
import { RegeneratePendingQuoteMessageCommand } from 'src/infrastructure/commands/regenerate-pending-quote-message.command'

@CommandHandler(SuspendDeleteWatchCommand)
export class DeleteWatcherService
  implements ICommandHandler<SuspendDeleteWatchCommand>, OnApplicationBootstrap
{
  private ignoredMessageIds = new Set<string>()

  constructor(
    @Inject(DISCORD_PROVIDER) private discord: Client,
    private logger: Logger,
    private redis: WrappedRedisClient,
    private commandBus: CommandBus,
  ) {}

  async execute({ payload }: SuspendDeleteWatchCommand) {
    const { messageId, removeSuspension } = payload
    const { ignoredMessageIds, logger } = this

    if (removeSuspension) {
      ignoredMessageIds.delete(messageId)
      logger.verbose(`Stopped ignoring ${messageId}`, DeleteWatcherService.name)
    } else {
      ignoredMessageIds.add(messageId)
      logger.verbose(`Now ignoring ${messageId}`, DeleteWatcherService.name)
    }
  }

  private async handleMessageDelete(message: Message) {
    const { logger, ignoredMessageIds, redis, commandBus } = this

    const messageId = message.id
    const quoteId = await redis.get(message.id)

    if (!quoteId) {
      // not in the watchlist
      return
    }

    if (quoteId && ignoredMessageIds.has(messageId)) {
      // in the watchlist, but was also found in the ignored list
      logger.log(
        `Overlooked deletion of watched message ${messageId} due to it being in the ignored list.`,
        DeleteWatcherService.name,
      )
      return
    }

    await commandBus.execute(
      new RegeneratePendingQuoteMessageCommand({ quoteId }),
    )
  }

  onApplicationBootstrap() {
    this.discord.on('messageDelete', this.handleMessageDelete.bind(this))
  }
}
