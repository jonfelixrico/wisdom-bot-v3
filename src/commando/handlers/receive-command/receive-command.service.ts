import { Injectable, Logger } from '@nestjs/common'
import { Message, MessageEmbed, MessageEmbedOptions, User } from 'discord.js'
import {
  CommandoClient,
  CommandInfo,
  CommandoMessage,
} from 'discord.js-commando'
import { IArgumentMap, WrappedCommand } from '../wrapped-command.class'
import { QuoteQueryService } from 'src/read-repositories/queries/quote-query/quote-query.service'
import { CommandBus } from '@nestjs/cqrs'
import { ReceiveQuoteCommand } from 'src/domain/commands/receive-quote.command'
import { SPACE_CHARACTER } from 'src/types/discord.constants'
import { DiscordHelperService } from 'src/discord/discord-helper/discord-helper.service'

const COMMAND_INFO: CommandInfo = {
  name: 'receive',
  group: 'commands',
  memberName: 'receive',
  description: 'Receive a random command.',
  argsPromptLimit: 0,
  args: [
    {
      key: 'user',
      type: 'user',
      prompt: '',
      default: () => null,
    },
  ],
}

export interface IReceiveCommandArgs extends IArgumentMap {
  user?: User
}

@Injectable()
export class ReceiveCommandService extends WrappedCommand<IReceiveCommandArgs> {
  constructor(
    client: CommandoClient,
    private quoteQuery: QuoteQueryService,
    private logger: Logger,
    private commandBus: CommandBus,
    private helper: DiscordHelperService,
  ) {
    super(client, COMMAND_INFO)
  }

  async run(
    message: CommandoMessage,
    { user }: IReceiveCommandArgs,
  ): Promise<Message | Message[]> {
    const { channel, guild, author } = message

    const response = await channel.send('Finding a quote...')

    const quoteId = await this.quoteQuery.getRandomQuoteId(guild.id, user?.id)
    if (!quoteId) {
      this.logger.verbose(
        user
          ? `No quotes found from user ${user.id} published under guild ${guild.id}.`
          : `No quotes found under guild ${guild.id}.`,
        ReceiveCommandService.name,
      )
      return await response.edit('No quotes available.')
    }

    const { year, content, authorId, receiveCount } =
      await this.quoteQuery.getQuoteData(quoteId)

    await this.commandBus.execute(
      new ReceiveQuoteCommand({
        channelId: channel.id,
        messageId: response.id,
        quoteId,
        userId: author.id,
      }),
    )

    const newReceiveCount = receiveCount + 1

    const embed: MessageEmbedOptions = {
      description: [`**"${content}"**`, `- <@${authorId}>, ${year}`].join('\n'),
      author: {
        name: 'Quote Received',
      },
      fields: [
        {
          name: SPACE_CHARACTER,
          value: `Received by ${message.author}`,
        },
      ],
      footer: {
        text: `This quote has been received ${newReceiveCount} ${
          newReceiveCount !== 1 ? 'times' : 'time'
        }`,
      },
      timestamp: new Date(),
    }

    const authorAvatarUrl = await this.helper.getGuildMemberAvatarUrl(
      message.guild.id,
      authorId,
    )

    const receiverAvatarUrl = await author.displayAvatarURL({ format: 'png' })

    if (authorAvatarUrl) {
      embed.thumbnail = {
        url: authorAvatarUrl,
      }
    }

    if (receiverAvatarUrl) {
      embed.author.icon_url = receiverAvatarUrl
    }

    await response.edit(null, new MessageEmbed(embed))

    this.logger.verbose(
      `Processed quote receive for ${quoteId}.`,
      ReceiveCommandService.name,
    )

    return response
  }
}
