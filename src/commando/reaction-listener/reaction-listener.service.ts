import { Injectable } from '@nestjs/common'
import { Message, MessageReaction } from 'discord.js'
import { CommandoClient } from 'discord.js-commando'
import { merge, Observable, of, race, Subject, timer } from 'rxjs'
import { debounceTime, filter, map, mapTo, takeUntil } from 'rxjs/operators'

function fromMessageReactionEvent(
  client: CommandoClient,
  eventName: 'messageReactionAdd' | 'messageReactionRemove',
) {
  const subj = new Subject<Message>()
  client.on(eventName, (reaction: MessageReaction) => {
    subj.next(reaction.message)
  })
  return subj.asObservable()
}

function buildSubjects(client: CommandoClient) {
  return merge(
    fromMessageReactionEvent(client, 'messageReactionAdd'),
    fromMessageReactionEvent(client, 'messageReactionRemove'),
  ).pipe(filter(({ author }) => author.id === client.user.id))
}

function getMessageReactionForEmoji(message: Message, emojiName: string) {
  return message.reactions.cache.array().find((r) => r.emoji.name === emojiName)
}

export interface IReactionListenerEmission {
  messageId: string
  status: 'COMPLETE' | 'EXPIRED'
}

@Injectable()
export class ReactionListenerService {
  private reactionChange$: Observable<Message>
  private unsubscribe$ = new Subject<string>()
  private client: CommandoClient

  private emitterSubj = new Subject<IReactionListenerEmission>()

  constructor(client: CommandoClient) {
    this.client = client
    this.reactionChange$ = buildSubjects(client)
  }

  watch(messageId: string) {
    // yeet
  }

  unwatch(messageId: string) {
    // yeet
  }

  get emitter() {
    return this.emitterSubj.asObservable()
  }

  destroyObserver(messageId: string) {
    this.unsubscribe$.next(messageId)
  }

  createObserver(
    messageId: string,
    emojiName: string,
    count: number,
    expireDt: Date,
  ) {
    if (expireDt < new Date()) {
      return of(false)
    }

    const expire$ = timer(expireDt).pipe(mapTo(false))
    const cancel$ = this.unsubscribe$.pipe(filter((val) => val === messageId))

    const complete$ = this.reactionChange$.pipe(
      takeUntil(cancel$),
      debounceTime(2500),
      filter(({ id }) => id === messageId),
      map((message) => getMessageReactionForEmoji(message, emojiName)),
      filter(
        (mr) =>
          mr &&
          mr.users.cache.filter((u) => u.id !== this.client.user.id).size >=
            count,
      ),
      mapTo(true),
    )

    return race(expire$, complete$)
  }
}
