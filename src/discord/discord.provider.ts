import { Provider } from '@nestjs/common'
import { Client } from 'discord.js'

export const discordProvider: Provider = {
  provide: Client,
  useFactory: () =>
    new Promise(async (resolve, reject) => {
      try {
        const client = new Client()
        client.once('ready', () => {
          resolve(client)
        })
        await client.login(process.env.DISCORD_TOKEN)
      } catch (e) {
        reject(e)
      }
    }),
}
