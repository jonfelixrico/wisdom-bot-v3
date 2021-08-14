import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Client } from 'discord.js'

export const discordProviders: Provider[] = [
  {
    provide: Client,
    useFactory: (cfg: ConfigService) =>
      new Promise(async (resolve, reject) => {
        try {
          const client = new Client()
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
]
