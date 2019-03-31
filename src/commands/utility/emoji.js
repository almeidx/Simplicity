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

  async run ({ channel, send, args, t }) {
    channel.startTyping().catch(() => {})
    const query = args[0]
    try {
      const clean = query.codePointAt().toString(16)
      const defaultEmoji = clean.split(RegexEmojis)[0]
      console.log(defaultEmoji, clean.match(RegexEmojis))

      if (defaultEmoji) {
        const clean = query.codePointAt().toString(16)
        const url = `https://twemoji.maxcdn.com/2/72x72/${clean}.png`
        console.log(url)

        const emoji = await request.get(url).catch(() => null)

        const attachment = new MessageAttachment(url, 'emoji.png')

        if (emoji && attachment) {
          return send(attachment).then(() => channel.stopTyping(true))
        }
      } else {
        console.log('custom')
        const id = defaultEmoji.split(':')[ defaultEmoji.split(':').length - 1 ].replace(/>/g, '')
        const gif = defaultEmoji.split(':')[0].replace(/</g, '') === 'a'
        return await send(new MessageAttachment(`https://cdn.discordapp.com/emojis/${id}.${gif ? 'gif' : 'png'}?v=1`, `emoji.${gif ? 'gif' : 'png'}`)).then(() => channel.stopTyping(true))
      }
    } catch (e) {
      console.error(e)
      await channel.stopTyping(true)
      throw new CommandError('commands:emoji.error')
    }
  }
}

module.exports = Emoji
