import { OnModuleInit } from '@nestjs/common'
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs'
import { Client, Message, MessageReaction, ReactionEmoji } from 'discord.js'
import { fromEvent, merge, Subject, timer } from 'rxjs'
import { PendingQuoteReactionsReachedEvent } from 'src/infrastructure/events/pending-quote-reactions-reached.event'
import { WatchPendingQuoteCommand } from '../../commands/watch-pending-quote.command'
import { filter, takeUntil } from 'rxjs/operators'
import { PendingQuoteReachedExpirationEvent } from 'src/infrastructure/events/pending-quote-reached-expiration.event'
import { PendingQuoteMessageDeletedEvent } from 'src/infrastructure/events/pending-quote-message-deleted.event'

interface IWatchedMessages {
  [messageId: string]: {
    quoteId: string
    upvoteCount: number
    upvoteEmoji: string
  }
}

@CommandHandler(WatchPendingQuoteCommand)
export class WatchPendingQuoteCommandHandlerService
  implements ICommandHandler<WatchPendingQuoteCommand>, OnModuleInit
{
  private stop$ = new Subject<string>()

  private watched: IWatchedMessages = {}

  constructor(private client: Client, private eventBus: EventBus) {}

  async execute({ payload }: WatchPendingQuoteCommand): Promise<any> {
    const { expireDt, message, quoteId, upvoteCount, upvoteEmoji } = payload

    this.watched[message.id] = {
      quoteId,
      upvoteCount,
      upvoteEmoji,
    }

    timer(expireDt)
      .pipe(
        takeUntil(
          this.stop$.pipe(
            filter((stoppedMessageId) => stoppedMessageId === message.id),
          ),
        ),
      )
      .subscribe(() => {
        // TODO add logging about expiration
        this.stop$.next(message.id)
        this.eventBus.publish(
          new PendingQuoteReachedExpirationEvent({
            message,
            quoteId,
          }),
        )
      })
  }

  onModuleInit() {
    const { client, stop$, watched } = this

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
      this.eventBus.publish(
        new PendingQuoteMessageDeletedEvent({
          message,
          quoteId: entry.quoteId,
        }),
      )
    })

    merge(
      fromEvent<MessageReaction>(client, 'messageReactionAdd'),
      fromEvent<MessageReaction>(client, 'messageReactionRemove'),
    ).subscribe(({ message, emoji, me, count }) => {
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
      }

      // the ternary operator is to subtract the reaction from the bot
      const reactionCount = count + (me ? -1 : 1)

      // emoji matches, but we haven't reached the count yet
      if (reactionCount < count) {
        return
      }

      stop$.next(message.id)
      this.eventBus.publish(
        new PendingQuoteReactionsReachedEvent({
          quoteId: entry.quoteId,
          message,
        }),
      )
    })
  }
}
