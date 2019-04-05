const { Command, MessageUtils, CommandError } = require('../..')
const { MessageAttachment } = require('discord.js')

const REGEX_CARACTERES_VALID = /[a-z0-9_]/gi
const REGEX_CARACTERES_INVALID = /[^a-z0-9_]/gi

class CreateEmoji extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['createmoji', 'addemoji']
    this.category = 'guild'
    this.requirements = {
      argsRequired: true,
      guildOnly: true,
      permissions: ['MANAGE_EMOJIS'],
      clientPermissions: ['EMBED_LINKS', 'MANAGE_EMOJIS'] }
  }

  async run ({ message, totalLength, channel, send, args: [name], author }) {
    const image = (await MessageUtils.getImage(message, totalLength)) || (await MessageUtils.fetchImage(channel))

    if (!image) throw new CommandError('commands:createemoji:noNameLink', { onUsage: true })

    const nameEmoji = name || 'emojiBy' + author.id
    if (nameEmoji.length >= 32) throw new CommandError('commands:createemoji:nameTooBig')
    if (nameEmoji.length <= 2) throw new CommandError('commands:createemoji:nameTooShort')

    if (REGEX_CARACTERES_INVALID.test(nameEmoji)) {
      const caracteresInvalid = name.replace(REGEX_CARACTERES_VALID, '').split('').filter((e, i, ar) => ar.indexOf(e) === i).join('')
      throw new CommandError('commands:createemoji:nameInvalid')
        .addField('errors:caracteresInvalid', `**${caracteresInvalid}**`)
    }

    const collector = channel.createMessageCollector((m) => author.id === m.author.id, { errors: ['time'], time: 60000 })
  }
}

module.exports = CreateEmoji
