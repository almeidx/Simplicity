const { Command, CommandError, RegexEmojis } = require('../../')
const { MessageAttachment } = require('discord.js')
const request = require('snekfetch')

class Emoji extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['emote']
    this.category = 'util'
    this.requirements = { argsRequired: true }
  }

  async run ({ channel, send, query, t }) {
    channel.startTyping().catch(() => {})
    try {
      const customEmoji = query.split(RegexEmojis)[0]

      if (customEmoji) {
        const id = customEmoji.split(':')[ customEmoji.split(':').length - 1 ].replace(/>/g, '')
        const gif = customEmoji.split(':')[0].replace(/</g, '') === 'a'
        return await send(new MessageAttachment(`https://cdn.discordapp.com/emojis/${id}.${gif ? 'gif' : 'png'}?v=1`, `emoji.${gif ? 'gif' : 'png'}`)).then(() => channel.stopTyping(true))
      }

      const clean = query.codePointAt().toString(16)
      const url = `https://twemoji.maxcdn.com/2/72x72/${clean}.png`
      console.log(url)
      const defaultEmoji = await request.get(url).catch(() => null)

      if (defaultEmoji && defaultEmoji.readable) {
        await send(new MessageAttachment(url, 'emoji.png')).then(() => channel.stopTyping(true))
      }
    } catch (e) {
      console.error(e)
      await channel.stopTyping(true)
      throw new CommandError('commands:emoji.error')
    }
  }
}

module.exports = Emoji
