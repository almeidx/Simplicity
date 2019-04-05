/* eslint-disable no-useless-escape */
const fetch = require('node-fetch')
const REGEX_URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i
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
    const result = resultRegex && resultRegex[0]
    return result
  }

  static async getImage (message, sliceCount = 0) {
    const url = this.getContentUrl(message, sliceCount)
    const resultQuery = await checkRequestURL(url)
    if (resultQuery) return url
    const attachments = message && message.attachments
    const attachment = attachments && attachments.find(a => AllowedImageFormats.some(format => a.name.endsWith(format)))
    const resultAttachment = attachment && (await checkRequestURL(attachment.url)) && attachment.url
    return resultAttachment
  }

  static async fetchImages (channel, limit = 100) {
    const messages = await channel.messages.fetch(limit).catch(() => null)
    const result = messages && (await Promise.all(messages.map(async message => {
      const r = await this.getImage(message)
      return r
    }))).filter(r => r)
    return result
  }

  static async fetchImage (channel, limit = 100) {
    const fetchResult = await this.fetchImages(channel, limit)
    const result = fetchResult && fetchResult[0]
    return result
  }
}

module.exports = MessageUtils
