const { SimplicityEmbed, Command, MessageUtils, CommandError, Parameters, MessageCollectorUtils } = require('../..')
const { StringParameter } = Parameters

const ParameterOptions = {
  defaultString: 'emoji',
  maxLength: 32,
  minLength: 2,
  regex: /[^a-z0-9_]/gi,
  errors: {
    maxLength: 'commands:addemoji:nameTooBig',
    minLength: 'commands:addemoji:nameTooShort',
    regex: 'commands:addemoji:nameInvalid'
  }
}

class AddEmoji extends Command {
  constructor (client) {
    super(client)
    this.aliases = [ 'createmoji', 'createemoji' ]
    this.category = 'guild'
    this.requirements = {
      argsRequired: true,
      guildOnly: true,
      permissions: [ 'MANAGE_EMOJIS' ],
      clientPermissions: [ 'EMBED_LINKS', 'MANAGE_EMOJIS' ] }
  }

  async run ({ args, author, channel, message, send, totalLength, t, guild }) {
    const name = await StringParameter.parse(args[0], ParameterOptions)
    const image = await MessageUtils.getImage(message, totalLength) || await MessageUtils.fetchImage(channel)
    if (!image)
      throw new CommandError('commands:addemoji:noNameLink', { onUsage: true })

    const embed = new SimplicityEmbed({ author, t }, { autoAuthor: false })
      .setDescription('commands:addemoji.waitingResponse')
      .setThumbnail(image)
    const msg = await send(embed)

    const dependencies = { msg, command: this, channel, author, send, t }
    const responses = { cancel: t('commands:addemoji:cancelled') }

    await MessageCollectorUtils.run(dependencies, responses, async () => {
      const emoji = await guild.emojis.create(image, name).catch(() => null)
      if (!emoji) throw new CommandError('commands:addemoji.error')

      const embed = new SimplicityEmbed({ author, t })
        .setDescription('commands:addemoji.emojiCreated', { emoji: emoji.toString() })
        .setTitle('commands:addemoji.success')
      return send(embed)
    })
  }
}

module.exports = AddEmoji
