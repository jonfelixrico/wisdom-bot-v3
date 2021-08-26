import {
  CommandBus,
  EventsHandler,
  IEventHandler,
  QueryBus,
} from '@nestjs/cqrs'
import { sprintf } from 'sprintf-js'
import { DiscordInteractionEvent } from 'src/discord-interactions/types/discord-interaction.event'
import { ReactToReceiveCommand } from 'src/domain/commands/react-to-receive.command'
import { IReceiveQueryOutput, ReceiveQuery } from 'src/queries/receive.query'

const CUSTOM_ID_REGEXP = /receive\/(.+)\/(.+)/

const EMOJI_MAPPING = {
  '1': '👍',
  '-1': '👎',
}

@EventsHandler(DiscordInteractionEvent)
export class ReceiveReactionButtonHandlerService
  implements IEventHandler<DiscordInteractionEvent>
{
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  async handle({ interaction }: DiscordInteractionEvent) {
    if (
      !interaction.isButton() ||
      !CUSTOM_ID_REGEXP.test(interaction.customId)
    ) {
      return
    }

    await interaction.deferReply()

    const [receiveId, strKarma] = CUSTOM_ID_REGEXP.exec(
      interaction.customId,
    ).slice(1)
    const karma = parseInt(strKarma)

    const receive: IReceiveQueryOutput = await this.queryBus.execute(
      new ReceiveQuery({ receiveId }),
    )

    if (!receive) {
      await interaction.editReply(
        'Sorry, but that quote is no longer accepting reactions.',
      )
      return
    }

    const userId = interaction.user.id

    try {
      await this.commandBus.execute(
        new ReactToReceiveCommand({
          karma,
          receiveId,
          userId,
        }),
      )

      const vote = receive.reactions.find(
        (reaction) => reaction.userId === userId,
      )

      if (!vote) {
        await interaction.editReply(`You have voted ${EMOJI_MAPPING[karma]}`)
        return
      }

      await interaction.editReply(
        sprintf(
          'You have changed your reaction from %s to %s',
          EMOJI_MAPPING[vote.karma],
          EMOJI_MAPPING[karma],
        ),
      )
    } catch (e) {
      await interaction.editReply(
        'Sorry, but something went wrong while processing your reaction. Maybe try again later?',
      )
    }
  }
}
