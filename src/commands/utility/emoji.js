const { Command, CommandError, RegexEmojis } = require('../../')
const { MessageAttachment } = require('discord.js')
const fetch = require('node-fetch')

const regexAnimated = /<a:/gi

class Emoji extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['emote']
    this.category = 'util'
    this.requirements = { argsRequired: true }
    this.responses = { argsRequired: 'commands:emoji.error' }
  }

  async run ({ channel, send, args }) {
    let result
    let type = 'png'

    const clean = args[0].codePointAt().toString(16)
    const defaultEmoji = clean && clean.split(RegexEmojis)[0]
    const defaultUrl = defaultEmoji && `https://twemoji.maxcdn.com/2/72x72/${defaultEmoji}.png`
    const emoji = defaultEmoji && await fetch(defaultUrl).then((r) => r.status !== 404).catch(() => null)

    if (emoji) result = defaultUrl

    if (!emoji && regexAnimated.test(args[0])) type = 'gif'

    const id = !emoji && args[0].split(':').pop().replace('>', '')
    const CustomUrl = id && `https://cdn.discordapp.com/emojis/${id}.${type}?v=1`
    const resultFetchURL = CustomUrl && await fetch(CustomUrl).then((r) => r.status !== 404).catch(() => null)

    if (resultFetchURL) result = CustomUrl

    if (!result) throw new CommandError('commands:emoji.error')

    const attachment = new MessageAttachment(result, `emoji.${type}`)

    return send(attachment).then(() => channel.stopTyping(true))
  }
}

module.exports = Emoji
