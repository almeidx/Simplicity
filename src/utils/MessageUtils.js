/* eslint-disable no-useless-escape */
const fetch = require('node-fetch')
const REGEX_URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i
const AllowedImageFormats = [
  'webp',
  'png',
  'jpg',
  'gif'
]

function checkRequestURL (url) {
  return fetch(url).then(r => r.status !== 404).catch(() => null)
}

class MessageUtils {
  static getContentUrl (message, sliceCount = 0) {
    const query = typeof message === 'string' ? message : (message.content ? message.content.slice(sliceCount) : null)
    const resultRegex = query && REGEX_URL.exec(query)
    return resultRegex && resultRegex[0]
  }

  static async getImage (message, sliceCount = 0) {
    const url = this.getContentUrl(message, sliceCount)
    const resultQuery = await checkRequestURL(url)
    if (resultQuery)
      return url

    const attachments = message && message.attachments
    const attachment = attachments && attachments.find(a => AllowedImageFormats.some(format => a.name.endsWith(format)))
    return attachment && await checkRequestURL(attachment.url) && attachment.url
  }

  static async fetchImages (channel, limit = 100) {
    const messages = await channel.messages.fetch(limit).catch(() => null)
    return messages && (await Promise.all(messages.map(message => {
      return this.getImage(message)
    }))).filter(r => r)
  }

  static async fetchImage (channel, limit = 100) {
    const fetchResult = await this.fetchImages(channel, limit)
    return fetchResult && fetchResult[0]
  }
}

module.exports = MessageUtils
