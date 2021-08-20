import { Injectable, OnModuleInit } from '@nestjs/common'
import { Subject } from 'rxjs'
import { DiscordHelperService } from 'src/discord/discord-helper/discord-helper.service'
import { filter, map, mergeMap, take } from 'rxjs/operators'
import { Message } from 'discord.js'
import { v4 } from 'uuid'

type IDoneItem =
  | {
      jobId: string
      message: Message
    }
  | {
      jobId: string
      error: Error
    }
  | {
      jobId: string
      inaccessible: true
    }

interface IFetchMessageInput {
  guildId: string
  channelId: string
  messageId: string
}

interface IQueueItem extends IFetchMessageInput {
  jobId: string
}

const CONCURRENCY_LIMIT = 5

@Injectable()
export class ThrottledMessageFetcherService implements OnModuleInit {
  private queue$ = new Subject<IQueueItem>()
  private done$ = new Subject<IDoneItem>()

  constructor(private helper: DiscordHelperService) {}

  fetchMessage(input: IFetchMessageInput) {
    const jobId = v4()
    try {
      return this.done$
        .pipe(
          filter((e) => e.jobId === jobId),
          take(1),
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          map(({ jobId, ...others }) => others),
        )
        .toPromise()
    } finally {
      this.queue$.next({
        ...input,
        jobId,
      })
    }
  }

  private async doFetchMessage({
    guildId,
    messageId,
    channelId,
    jobId,
  }: IQueueItem): Promise<IDoneItem> {
    const { done$, helper } = this
    try {
      const guild = await helper.getGuild(guildId)
      if (!guild || !guild.available) {
        done$.next()
        return {
          jobId,
          inaccessible: true,
        }
      }

      const [channel, permissions] =
        (await helper.getTextChannelAndPermissions(guildId, channelId)) || []

      if (!channel || !permissions.has('READ_MESSAGE_HISTORY')) {
        return {
          jobId,
          inaccessible: true,
        }
      }

      const message = await helper.getMessage(guildId, channelId, messageId)
      return {
        jobId,
        message,
      }
    } catch (e) {
      return {
        jobId,
        error: e,
      }
    }
  }

  onModuleInit() {
    this.queue$
      .pipe(
        mergeMap(async (item) => {
          const result = await this.doFetchMessage(item)
          this.done$.next(result)
        }, CONCURRENCY_LIMIT),
      )
      .subscribe()
  }
}
