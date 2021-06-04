/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs')
const uuid = require('uuid')
const path = require('path')
const { Parser } = require('json2csv')

const [filename] = process.argv.slice(2)
const str = fs.readFileSync(filename, {
  encoding: 'utf-8',
})

const parsedJson = JSON.parse(str)

const quotes = []
const receives = []

const convertDateToMysqlDate = (dateStr) =>
  dateStr
    ? new Date(dateStr).toISOString().slice(0, 19).replace('T', ' ')
    : null

function convertNullsToMySqlNull(obj) {
  const entries = Object.entries(obj).map(([key, value]) => [
    key,
    value || 'NULL',
  ])

  return Object.fromEntries(entries)
}

function processReceive(
  quoteId,
  { channelId, messageId, serverId: guildId, receiverId: userId, receiveDt },
) {
  const receive = {
    id: uuid.v4(),
    channelId,
    messageId,
    guildId,
    userId,
    receiveDt: convertDateToMysqlDate(receiveDt.$date),
    quoteId,
  }

  receives.push(convertNullsToMySqlNull(receive))
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
  content = content.replace(/[\n\r\"]/g, '')
  const id = uuid.v4()
  const quote = {
    submitterId,
    submitDt: convertDateToMysqlDate(submitDt.$date),
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
      expireDt: convertDateToMysqlDate(expireDt.$date),
      approvalEmoji: emoji,
      approvalCount: count,
      approveDt: null,
    })
  } else {
    Object.assign(quote, {
      channelId: null,
      messageId: null,
      expireDt: null,
      approvalEmoji: null,
      approvalCount: null,
      approveDt: convertDateToMysqlDate(submitDt.$date),
    })
  }

  quotes.push(convertNullsToMySqlNull(quote))
  receives.forEach((r) => processReceive(id, r))
}

parsedJson.forEach(processQuote)

function convertToCsvAndSave(objectOrArray, destination) {
  const parser = new Parser()
  const csv = parser.parse(objectOrArray)
  fs.writeFileSync(destination, csv, {
    encoding: 'utf-8',
  })
}

async function exportFiles() {
  convertToCsvAndSave(receives, path.join(__dirname, 'receives-export.csv'))
  convertToCsvAndSave(quotes, path.join(__dirname, 'quotes-export.csv'))

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

  console.debug(
    `Exported ${quotes.length} quotes and ${receives.length} receives.`,
  )
}

exportFiles()
