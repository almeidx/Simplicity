const { MessageEmbed } = require('discord.js')
const { Command } = require('../..')

class CreateEmoji extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['createmoji', 'addemoji']
    this.category = 'guild'
    this.requirements = { argsRequired: true, permissions: ['MANAGE_EMOJIS'], clientPermissions: ['MANAGE_EMOJIS'] }
  }

  run ({ guild, author, send, t, args }) {
    const embed = new MessageEmbed()
      .setAuthor(author.tag, author.displayAvatarURL({ size: 2048 }))

    if (args.length <= 1) {
      embed.setDescription(t('commands:createemoji.noNameLink'))
      return send(embed, { error: true })
    }

    const name = args.shift()
    const url = args.join('')

    if (!name.length >= 32) {
      embed
        .setDescription(t('commands:createemoji.nameTooBig'))
      return send(embed, { error: true })
    } else if (!name.length >= 2) {
      embed
        .setDescription(t('commands:createemoji.nameTooShort'))
      return send(embed, { error: true })
    } else if (!name.match('(^[a-zA-Z0-9_]*$)')) {
      embed
        .setDescription(t('commands:createemoji.invalidName'))
      return send(embed, { error: true })
    } else if (url.startsWith('http://' || 'https://') && url.includes('.png' || '.gif' || '.webp' || '.jpg' || '.jpeg')) {
      embed
        .setDescription(t('commands:createemoji.invalidURL'))
      return send(embed, { error: true })
    } else {
      guild.emojis.create(url, name)
        .then(e => {
          embed
            .setTitle(t('commands:createemoji.emojiCreated'))
            .setDescription(e)
          send(embed)
        })
        .catch(() => {
          embed
            .setDescription(t('commands:createemoji.error'))
          return send(embed, { error: true })
        })
    }
  }
}

module.exports = CreateEmoji
