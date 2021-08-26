import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { CommandBus, EventBus, ofType, QueryBus } from '@nestjs/cqrs'
import {
  Client,
  InteractionWebhook,
  MessageActionRow,
  MessageButton,
  MessageEditOptions,
  MessageEmbedOptions,
  Util,
} from 'discord.js'
import { debounceTime, filter, groupBy, mergeMap } from 'rxjs/operators'
import { sprintf } from 'sprintf-js'
import { DiscordHelperService } from 'src/discord/discord-helper/discord-helper.service'
import { UpdateReceiveMessageDetailsCommand } from 'src/domain/commands/update-receive-message-details.command'
import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { IReceiveQueryOutput, ReceiveQuery } from 'src/queries/receive.query'
import { ReadModelSyncedEvent } from 'src/read-model-catch-up/read-model-synced.event'

const { RECEIVE_REACTION_WITHDRAWN, RECEIVE_REACTED, RECEIVE_CREATED } =
  DomainEventNames

const EVENTS = new Set<string>([
  RECEIVE_CREATED,
  RECEIVE_REACTED,
  RECEIVE_REACTION_WITHDRAWN,
])

@Injectable()
export class ReceiveMessageUpdaterService implements OnModuleInit {
  constructor(
    private eventBus: EventBus,
    private queryBus: QueryBus,
    private logger: Logger,
    private helper: DiscordHelperService,
    private discord: Client,
    private commandBus: CommandBus,
  ) {}

  private async handleInteractionToken(receive: IReceiveQueryOutput) {
    const { discord } = this
    const webhook = new InteractionWebhook(
      discord,
      discord.application.id,
      receive.interactionToken,
    )

    const message = await webhook.send(await this.generateResponse(receive))

    await this.commandBus.execute(
      new UpdateReceiveMessageDetailsCommand({
        receiveId: receive.receiveId,
        channelId: receive.channelId,
        messageId: message.id,
      }),
    )
  }

  private async doMessageUpdate(receiveId: string) {
    const { logger, helper } = this

    logger.debug(
      `Updating message for quote ${receiveId}`,
      ReceiveMessageUpdaterService.name,
    )

    const receive = (await this.queryBus.execute(
      new ReceiveQuery({ receiveId }),
    )) as IReceiveQueryOutput

    if (!receive) {
      logger.warn(
        `Attempted to update message for unknown receive ${receiveId}`,
        ReceiveMessageUpdaterService.name,
      )
      return
    }

    const { channelId, messageId, guildId, interactionToken } = receive

    if (!messageId && interactionToken) {
      await this.handleInteractionToken(receive)
      return
    }

    const guild = await helper.getGuild(guildId)

    if (!guild.available) {
      logger.warn(
        `Guild ${guildId} is inaccessible. Can't update.`,
        ReceiveMessageUpdaterService.name,
      )
      return
    }

    const [channel, permissions] =
      (await helper.getTextChannelAndPermissions(guildId, channelId)) || []

    if (!channel) {
      logger.warn(
        `Channel ${channelId} not found. Can't update.`,
        ReceiveMessageUpdaterService.name,
      )
      return
    }

    if (!permissions.has('READ_MESSAGE_HISTORY')) {
      logger.warn(
        `No history read rights for ${channelId}. Can't update.`,
        ReceiveMessageUpdaterService.name,
      )
      return
    }

    const message = await helper.getMessage(guildId, channelId, messageId, true)
    if (!message) {
      logger.warn(
        `Attempted cannot find message ${messageId} for receive ${receiveId}`,
        ReceiveMessageUpdaterService.name,
      )
      return
    }

    if (!message.editable) {
      logger.warn(
        `Message ${messageId} can no longer be updated.`,
        ReceiveMessageUpdaterService.name,
      )
      return
    }

    await message.edit(await this.generateResponse(receive))

    logger.verbose(
      `Updated the displayed message for receive ${receiveId}`,
      ReceiveMessageUpdaterService.name,
    )
  }

  private async generateResponse({
    quote,
    userId,
    guildId,
    receiveCountSnapshot,
    receiveId,
    reactions,
  }: IReceiveQueryOutput): Promise<MessageEditOptions> {
    const { helper } = this
    const { content, authorId, submitDt } = quote

    const points = reactions.reduce((sum, reaction) => sum + reaction.karma, 0)

    const embed: MessageEmbedOptions = {
      description: [
        `**"${Util.escapeMarkdown(content)}"**`,
        `- <@${authorId}>, ${submitDt.getFullYear()}`,
        '',
        `Received by <@${userId}>`,
        '',
        sprintf(
          'This received quote has garnered a total of **%d** points. To contribute points, give this a 👍 or 👎 by clicking a button below',
          points,
        ),
      ].join('\n'),

      author: {
        name: 'Quote Received',
        icon_url: await helper.getGuildMemberAvatarUrl(guildId, userId),
      },

      footer: {
        text: `This quote has been received ${receiveCountSnapshot} ${
          receiveCountSnapshot !== 1 ? 'times' : 'time'
        }`,
      },

      timestamp: new Date(),

      thumbnail: {
        url: await this.helper.getGuildMemberAvatarUrl(
          quote.guildId,
          quote.authorId,
        ),
      },
    }

    const row = new MessageActionRow({
      components: [
        new MessageButton({
          customId: `receive/${receiveId}/react/1`,
          style: 'SUCCESS',
          emoji: '👍',
        }),
        new MessageButton({
          customId: `receive/${receiveId}/react/-1`,
          style: 'DANGER',
          emoji: '👎',
        }),
      ],
    })

    return {
      embeds: [embed],
      components: [row],
    }
  }

  onModuleInit() {
    this.eventBus
      .pipe(
        ofType(ReadModelSyncedEvent),
        filter(({ event }) => EVENTS.has(event.eventName)),
        groupBy(({ event }) => event.aggregateId),
        mergeMap((e) => {
          return e.pipe(debounceTime(3000))
        }),
      )
      .subscribe(async ({ event }) => {
        await this.doMessageUpdate(event.aggregateId)
      })
  }
}
