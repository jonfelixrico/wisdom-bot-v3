/* eslint-disable @typescript-eslint/no-var-requires */

const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')

const [token, applicationId, guildId] = process.argv.slice(2)

const rest = new REST({ version: '9' }).setToken(token)
const apiRoute = Routes.applicationGuildCommands(applicationId, guildId)

async function run() {
  await rest.put(apiRoute, {
    body: {},
  })

  console.log('Cleared them commands')
}

run()
