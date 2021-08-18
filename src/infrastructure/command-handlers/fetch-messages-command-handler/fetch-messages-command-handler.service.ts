import { Logger, OnModuleInit } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Subject } from 'rxjs'
import { filter, mergeMap, take } from 'rxjs/operators'
import { DiscordHelperService } from 'src/discord/discord-helper/discord-helper.service'
import {
  FetchMessagesCommand,
  IFetchMessagesCommandPayload,
} from 'src/infrastructure/commands/fetch-messages.command'
import { v4 } from 'uuid'

interface IQueue extends IFetchMessagesCommandPayload {
  jobId: string
}

const CONCURRENCY_LIMIT = 5

@CommandHandler(FetchMessagesCommand)
export class FetchMessagesCommandHandlerService
  implements ICommandHandler<FetchMessagesCommand>, OnModuleInit
{
  private queue$ = new Subject<IQueue>()
  private done$ = new Subject<string>()

  constructor(private helper: DiscordHelperService, private logger: Logger) {}

  async fetch({
    guildId,
    channelId,
    messageIds,
  }: IFetchMessagesCommandPayload) {
    const { helper, logger } = this

    const guild = await helper.getGuild(guildId)
    if (!guild || !guild.available) {
      logger.warn(
        `Cannot find guild ${guildId}. Aborted fetch.`,
        FetchMessagesCommandHandlerService.name,
      )
      return
    }

    const [channel, permissions] =
      (await helper.getTextChannelAndPermissions(guildId, channelId)) || []

    if (!channel) {
      logger.warn(
        `Cannot find channel ${channelId} @ guild ${guildId}. Aborted fetch.`,
        FetchMessagesCommandHandlerService.name,
      )
      return
    }

    if (!permissions.has('READ_MESSAGE_HISTORY')) {
      logger.warn(
        `No READ_MESSAGE_HISTORY access to channel ${channelId} @ guild ${guildId}. Aborted fetch.`,
        FetchMessagesCommandHandlerService.name,
      )
    }

    for (const messageId of messageIds) {
      try {
        await helper.getMessage(guildId, channelId, messageId)

        logger.verbose(
          `Fetched message ${messageId}.`,
          FetchMessagesCommandHandlerService.name,
        )
      } catch (e) {
        logger.error(
          `Fetching of message ${messageId} failed: ${e.message}`,
          e.stack,
          FetchMessagesCommandHandlerService.name,
        )

        // error intentionally suppressed
      }
    }
  }

  onModuleInit() {
    this.queue$
      .pipe(
        mergeMap(async ({ jobId, ...payload }) => {
          await this.fetch(payload)
          return jobId
        }, CONCURRENCY_LIMIT),
      )
      .subscribe((jobId) => this.done$.next(jobId))
  }

  async execute({ payload }: FetchMessagesCommand): Promise<void> {
    const jobId = v4()

    this.queue$.next({ ...payload, jobId })
    await this.done$
      .pipe(
        filter((id) => id === jobId),
        take(1),
      )
      .toPromise()
  }
}
