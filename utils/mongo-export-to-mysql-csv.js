/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs')
const uuid = require('uuid')
const path = require('path')
const jsonexport = require('jsonexport')

const [filename] = process.argv.slice(2)
const str = fs.readFileSync(filename, {
  encoding: 'utf-8',
})

const parsedJson = JSON.parse(str)

const quotes = []
const receives = []

const convertToMySql = (dateStr) =>
  dateStr
    ? new Date(dateStr).toISOString().slice(0, 19).replace('T', ' ')
    : 'NULL'

function processReceive(
  quoteId,
  { channelId, messageId, serverId: guildId, receiverId: userId, receiveDt },
) {
  receives.push({
    id: uuid.v4(),
    channelId,
    messageId,
    guildId,
    userId,
    receiveDt: convertToMySql(receiveDt.$date),
    quoteId,
  })
}

function processQuote({
  submitterId,
  submitDt,
  content,
  serverId: guildId,
  authorId,
  submissionStatus,
  receives = [],
}) {
  const id = uuid.v4()
  const quote = {
    submitterId,
    submitDt: convertToMySql(submitDt.$date),
    content,
    guildId,
    authorId,
    id,
  }

  if (submissionStatus) {
    const { expireDt, channelId, messageId, count, emoji } = submissionStatus
    Object.assign(quote, {
      channelId,
      messageId,
      expireDt: convertToMySql(expireDt.$date),
      approvalEmoji: emoji,
      approvalCount: count,
      approveDt: 'NULL',
    })
  } else {
    Object.assign(quote, {
      channelId: 'NULL',
      messageId: 'NULL',
      expireDt: 'NULL',
      approvalEmoji: 'NULL',
      approvalCount: 'NULL',
      approveDt: convertToMySql(submitDt.$date),
    })
  }

  quotes.push(quote)
  receives.forEach((r) => processReceive(id, r))
}

parsedJson.forEach(processQuote)

async function exportFiles() {
  const quotesCsv = await jsonexport(quotes)
  const receivesCsv = await jsonexport(receives)
  fs.writeFileSync(path.join(__dirname, 'quotes-export.csv'), quotesCsv, {
    encoding: 'utf-8',
  })
  fs.writeFileSync(path.join(__dirname, 'receives-export.csv'), receivesCsv, {
    encoding: 'utf-8',
  })
  fs.writeFileSync(
    path.join(__dirname, 'receives-export.json'),
    JSON.stringify(receives),
    {
      encoding: 'utf-8',
    },
  )
  fs.writeFileSync(
    path.join(__dirname, 'quotes-export.json'),
    JSON.stringify(quotes),
    {
      encoding: 'utf-8',
    },
  )
}

exportFiles()
