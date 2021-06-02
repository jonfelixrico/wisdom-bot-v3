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

type StatusString = 'COMPLETE' | 'EXPIRED'
export interface IReactionListenerEmission {
  messageId: string
  status: StatusString
}

@Injectable()
export class ReactionListenerService {
  private reaction$: Observable<Message>
  private unwatchSubj = new Subject<string>()
  private watched = new Set<string>()
  private client: CommandoClient

  private emitterSubj = new Subject<IReactionListenerEmission>()

  constructor(client: CommandoClient) {
    this.client = client
    this.reaction$ = buildSubjects(client)
  }

  watch(messageId: string, emojiName: string, count: number, expireDt: Date) {
    if (this.watched.has(messageId)) {
      return
    }

    this.watched.add(messageId)
    this.createObserver(messageId, emojiName, count, expireDt).subscribe(
      (val) => {
        this.watched.delete(messageId)
        this.emitterSubj.next(val)
      },
    )
  }

  unwatch(messageId: string) {
    this.watched.delete(messageId)
    this.unwatchSubj.next(messageId)
  }

  get emitter() {
    return this.emitterSubj.asObservable()
  }

  destroyObserver(messageId: string) {
    this.unwatchSubj.next(messageId)
  }

  private createObserver(
    messageId: string,
    emojiName: string,
    count: number,
    expireDt: Date,
  ) {
    if (expireDt < new Date()) {
      return of<IReactionListenerEmission>({
        messageId,
        status: 'EXPIRED',
      })
    }

    const expire$ = timer(expireDt).pipe(mapTo('EXPIRED'))
    const cancel$ = this.unwatchSubj.pipe(filter((val) => val === messageId))

    const complete$ = this.reaction$.pipe(
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
      mapTo('COMPLETE'),
    )

    return race(expire$, complete$).pipe(
      map<StatusString, IReactionListenerEmission>((status) => ({
        messageId,
        status,
      })),
    )
  }
}
