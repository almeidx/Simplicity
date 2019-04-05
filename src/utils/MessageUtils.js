const fetch = require('node-fetch')
const REGEX_URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi
const AllowedImageFormats = [
  'webp',
  'png',
  'jpg',
  'gif'
]

async function checkRequestURL (url) {
  const result = await fetch(url).then(r => r.status !== 404).catch(() => null)
  return result
}

class MessageUtils {
  static getContentUrl (message, sliceCount = 0) {
    const query = typeof message === 'string' ? message : (message.content ? message.content.slice(sliceCount) : null)
    const resultRegex = query && REGEX_URL.exec(query)
    const result = resultRegex && resultRegex[1]
    return result
  }

  static async getImage (message, sliceCount = 0) {
    const url = this.getContentUrl(message, sliceCount)
    const resultQuery = await checkRequestURL(url)
    if (resultQuery) return resultQuery
    const attachments = message && message.attachments
    const attachment = attachments && attachments.find(a => AllowedImageFormats.some(format => a.name.endsWith(format)))
    const resultAttachment = attachment && (await checkRequestURL(attachment))
    return resultAttachment
  }

  static async fetchImage (channel, limit = 100) {
    const messages = await channel.messages.fetch(limit)
    const findResult = messages.find(async message => !!(await this.getImage(message)))
    const result = await this.getImage(findResult)
    return result
  }
}

module.exports = MessageUtils
