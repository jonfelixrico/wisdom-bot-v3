import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Client } from 'discord.js'
import { CommandoClient } from 'discord.js-commando'

export const discordProviders: Provider[] = [
  {
    provide: CommandoClient,
    useFactory: (cfg: ConfigService) =>
      new Promise(async (resolve, reject) => {
        try {
          const client = new CommandoClient()
          client.once('ready', () => {
            resolve(client)
          })
          await client.login(cfg.get('DISCORD_TOKEN'))
        } catch (e) {
          reject(e)
        }
      }),
    inject: [ConfigService],
  },
  {
    provide: Client,
    useExisting: CommandoClient,
  },
]
