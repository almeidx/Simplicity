const { Command, Embed, MessageUtils, CommandError } = require('../..')

const VALID_CHARACTERS_REGEX = /[a-z0-9_]/gi
const INVALID_CHARACTERS_REGEX = /[^a-z0-9_]/gi

const wordsContinue = ['y', 'yes', 'sim', 's', 'continue']
const wordsCancel = ['n', 'não', 'not', 'cancel']

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

  async run ({ args: [name], author, channel, client, message, send, totalLength, t }) {
    const embed = new Embed({ author, t })

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

    const permissions = channel.permissionsFor(client.user)
    const reason = t('commands:addemoji.reason', { user: author.tag })

    if (permissions.has('ADD_REACTIONS')) {
      await send('to esperando a resposta po')
      const filter = (u) => author.id === u.id
      const collector = channel.createMessageCollector(filter, { errors: ['time'], time: 60000 })

      collector.on('collect',async ({ content }) => {
        if (wordsContinue.includes(conten.toLowerCase())) {
          const emoji = await guild.emojis.create(image, nameEmoji, { reason }).catch(() => { return send('deu merda') })
          embed
            .setTitle('commands:addemoji.success')
            .setDescription('commands:addemoji.emojiCreated', { emoji: emoji.toString() })

          return send(embed)
        } else if (wordsCancel.includes(content.toLowerCase())) {
          embed
            .setTitle('utils:cancelled')
            .setDescription('commands:addemoji.cancelled')

          return send(embed)
        }
      })
    }
  }
}

module.exports = AddEmoji
