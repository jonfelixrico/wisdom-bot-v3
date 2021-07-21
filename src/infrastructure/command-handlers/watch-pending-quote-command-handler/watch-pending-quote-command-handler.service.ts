import { Logger, OnModuleInit } from '@nestjs/common'
import {
  CommandBus,
  CommandHandler,
  EventBus,
  ICommandHandler,
} from '@nestjs/cqrs'
import { Client, Message, MessageReaction, ReactionEmoji } from 'discord.js'
import { fromEvent, merge, Subject, timer } from 'rxjs'
import { WatchPendingQuoteCommand } from '../../commands/watch-pending-quote.command'
import { filter, takeUntil } from 'rxjs/operators'
import { RegeneratePendingQuoteMessageCommand } from 'src/infrastructure/commands/regenerate-pending-quote-message.command'
import { AcceptPendingQuoteCommand } from 'src/domain/commands/accept-pending-quote.command'
import { AcknowledgePendingQuoteExpirationCommand } from 'src/domain/commands/acknowledge-pending-quote-expiration.command'

interface IWatchedMessages {
  [messageId: string]: {
    quoteId: string
    upvoteCount: number
    upvoteEmoji: string
    expireDt: Date
  }
}

@CommandHandler(WatchPendingQuoteCommand)
export class WatchPendingQuoteCommandHandlerService
  implements ICommandHandler<WatchPendingQuoteCommand>, OnModuleInit
{
  private stop$ = new Subject<string>()

  private watched: IWatchedMessages = {}

  constructor(
    private client: Client,
    private eventBus: EventBus,
    private commandBus: CommandBus,
    private logger: Logger,
  ) {}

  async execute({ payload }: WatchPendingQuoteCommand): Promise<any> {
    const { expireDt, message, quoteId, upvoteCount, upvoteEmoji } = payload

    this.logger.debug(
      `Received command to watch over quote ${quoteId}`,
      WatchPendingQuoteCommandHandlerService.name,
    )

    this.watched[message.id] = {
      quoteId,
      upvoteCount,
      upvoteEmoji,
      expireDt,
    }

    timer(expireDt)
      .pipe(
        takeUntil(
          this.stop$.pipe(
            filter((stoppedMessageId) => stoppedMessageId === message.id),
          ),
        ),
      )
      .subscribe(async () => {
        this.logger.verbose(
          `Quote ${quoteId} has lapsed its expiration date.`,
          WatchPendingQuoteCommandHandlerService.name,
        )

        this.stop$.next(message.id)
        await this.commandBus.execute(
          new AcknowledgePendingQuoteExpirationCommand({
            quoteId,
          }),
        )
      })
  }

  onModuleInit() {
    const { client, stop$, watched, logger } = this

    stop$.subscribe((messageId) => {
      delete watched[messageId]
    })

    fromEvent<Message>(client, 'messageDelete').subscribe((message) => {
      const messageId = message.id
      const entry = watched[messageId]
      if (!entry) {
        return
      }

      // TODO add verbose logging here to say that message has been deleted while watching
      stop$.next(messageId)

      // intentionally didn't wait for this execute to finish
      this.commandBus.execute(
        new RegeneratePendingQuoteMessageCommand({
          quoteId: entry.quoteId,
        }),
      )

      logger.verbose(
        `Message ${messageId} of quote ${entry.quoteId} got deleted. Attempting to regenerate.`,
        WatchPendingQuoteCommandHandlerService.name,
      )
    })

    merge(
      fromEvent<[MessageReaction]>(client, 'messageReactionAdd'),
      fromEvent<[MessageReaction]>(client, 'messageReactionRemove'),
    ).subscribe(([{ message, emoji, me, count }]) => {
      const entry = watched[message.id]
      if (!entry) {
        // message is not being watched
        return
      } else if (
        !(emoji instanceof ReactionEmoji) ||
        emoji.name !== entry.upvoteEmoji
      ) {
        // message is being watched, but the reaction that we received does not match
        return
      } else if (me) {
        // The bot itself triggered the reaction event
        return
      }

      const { quoteId, upvoteCount } = entry

      // we're doing -1 because we're assuming that the bot has always reacted to the message
      const reactionCount = count - 1

      logger.debug(
        `Upvote reaction change detected for quote ${quoteId}; new count is ${reactionCount}`,
        WatchPendingQuoteCommandHandlerService.name,
      )

      // emoji matches, but we haven't reached the count yet
      if (reactionCount < upvoteCount) {
        return
      }

      stop$.next(message.id)
      this.commandBus.execute(new AcceptPendingQuoteCommand(quoteId))
      logger.verbose(
        `Completed the required reactions for quote ${quoteId}`,
        WatchPendingQuoteCommandHandlerService.name,
      )
    })
  }
}