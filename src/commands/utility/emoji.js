const { Command, RegexEmojis } = require('../../')
const { MessageEmbed, MessageAttachment } = require('discord.js')
const request = require('snekfetch')

class Emoji extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['emote']
    this.category = 'util'
    this.requirements = { argsRequired: true }
  }
  async run ({ send, args, t }) {
    const embed = new MessageEmbed()
      .setColor('36393f')
    try {
      let custom = args.join(' ').split(RegexEmojis)[0]
      if (custom) {
        const id = custom.split(':')[ custom.split(':').length - 1 ].replace(/>/g, '')
        const gif = custom.split(':')[0].replace(/</g, '') === 'a'
        embed.setImage(`attachment://Simplicity-Emoji.${gif ? 'gif' : 'png'}`)
          .attachFiles(new MessageAttachment(`https://cdn.discordapp.com/emojis/${id}.${gif ? 'gif' : 'png'}?v=1`, `Simplicity-Emoji.${gif ? 'gif' : 'png'}`))
        await send(embed)
          .catch(async () => {
            const url = `https://twemoji.maxcdn.com/2/72x72/${args.join(' ').codePointAt().toString(16)}.png`
            await request.get(url)
            embed.setImage('attachment://Simplicity-Emoji.png')
              .attachFiles(new MessageAttachment(url, 'Simplicity-Emoji.png'))
            await send(embed)
              .catch(() => {
                send(embed, { error: true })
              })
          })
      }
    } catch (err) {
      send('DEU MERDA PORRA SLA')
    }
  }
}
module.exports = Emoji
