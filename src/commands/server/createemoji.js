const { MessageEmbed } = require('discord.js')
const { Command } = require('../..')

class CreateEmoji extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['createmoji', 'addemoji']
    this.category = 'server'
    this.requirements = { argsRequired: true, permissions: ['MANAGE_EMOJIS'], clientPermissions: ['MANAGE_EMOJIS'] }
  }
  run ({ guild, author, send, t, args }) {
    const embed = new MessageEmbed()
      .setFooter(`${t('utils:footer')} ${author.tag}`, author.displayAvatarURL({ size: 2048 }))
      .setAuthor(author.tag, author.displayAvatarURL({ size: 2048 }))
      .setColor('RED')
    if (args.length <= 1) {
      embed.setTitle(t('errors:denied'))
        .setDescription(t('commands:createemoji.noNameLink'))
      return send(embed)
    }
    const name = args.shift()
    const url = args.join('')
    if (!name.length >= 32) {
      embed.setTitle(t('errors:denied'))
        .setDescription(t('commands:createemoji.nameTooBig'))
      return send(embed)
    } else if (!name.length >= 2) {
      embed.setTitle(t('errors:denied'))
        .setDescription(t('commands:createemoji.nameTooShort'))
      return send(embed)
    } else if (!name.match('(^[a-zA-Z0-9_]*$)')) {
      embed.setTitle(t('errors:denied'))
        .setDescription(t('commands:createemoji.invalidName'))
      return send(embed)
    } else if (url.startsWith('http://' || 'https://') &&
              url.includes('.png' || '.gif' || '.webp' || '.jpg' || '.jpeg')) {
      embed.setTitle(t('errors:denied'))
        .setDescription(t('commands:createemoji.invalidURL'))
      return send(embed)
    } else {
      guild.emojis.create(url, name)
        .then(e => {
          embed.setTitle(t('commands:createemoji.emojiCreated'))
            .setDescription(`\`:${e.name}:\``)
            .setImage(url)
            .setColor(process.env.COLOR)
          send(embed)
        })
        .catch(() => {
          embed.setTitle(t('errors:oops'))
            .setDescription(t('commands:createemoji.error'))
          return send(embed)
        })
    }
  }
}
module.exports = CreateEmoji
