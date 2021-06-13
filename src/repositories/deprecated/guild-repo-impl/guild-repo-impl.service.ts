import { Injectable } from '@nestjs/common'
import {
  GuildRepository,
  IGuildSettings,
} from 'src/classes/guild-repository.abstract'

const GUILD_SETTINGS: IGuildSettings = {
  approveEmoji: '🤔',
  expireMillis: new Date('1970/1/3').getTime(),
  approveCount: 1,
}

@Injectable()
export class GuildRepoImplService extends GuildRepository {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getQuoteSettings(guildId: string): Promise<IGuildSettings> {
    // TODO make this dynamic via DB
    return GUILD_SETTINGS
  }
}
