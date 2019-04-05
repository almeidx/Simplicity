const { Command, MessageUtils, CommandError } = require('../..')
const { MessageAttachment } = require('discord.js')

const VALID_CHARACTERS_REGEX = /[a-z0-9_]/gi
const INVALID_CHARACTERS_REGEX = /[^a-z0-9_]/gi

class AddEmoji extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['createmoji', 'createemoji']
    this.category = 'guild'
    this.requirements = {
      argsRequired: true,
      guildOnly: true,
      permissions: ['MANAGE_EMOJIS'],
      clientPermissions: ['EMBED_LINKS', 'MANAGE_EMOJIS'] }
  }

  async run ({ message, totalLength, channel, send, args: [name], author }) {
    const image = (await MessageUtils.getImage(message, totalLength)) || (await MessageUtils.fetchImage(channel))

    if (!image) throw new CommandError('commands:addemoji:noNameLink', { onUsage: true })

    const nameEmoji = name || t('commands:addemoji.emojiBy', { user: author.tag})
    if (nameEmoji.length >= 32) throw new CommandError('commands:addemoji:nameTooBig')
    if (nameEmoji.length <= 2) throw new CommandError('commands:addemoji:nameTooShort')

    if (INVALID_CHARACTERS_REGEX.test(nameEmoji)) {
      const invalidCharacters = name.replace(VALID_CHARACTERS_REGEX, '').split('').filter((e, i, ar) => ar.indexOf(e) === i).join('')
      throw new CommandError('commands:addemoji:nameInvalid')
        .addField('errors:invalidCharacters', `**${invalidCharacters}**`)
    }

    const filter = (r, u) => r.me && author.id === u.id
    const collector = channel.createMessageCollector(filter, { errors: ['time'], time: 60000 })

  }
}

module.exports = AddEmoji
