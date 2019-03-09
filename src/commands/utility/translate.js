const { MessageAttachment } = require('discord.js')
const { Command, CommandError, Embed } = require('../../')
const translate = require('node-google-translate-skidz')

class Translate extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['googletranslate', 'google-translate']
    this.category = 'util'
    this.requirements = { argsRequired: true }
  }

  run ({ author, send, query, t }) {
    const embed = new Embed({ author, t })

    translate({ text: query, target: 'en' }, function (result) {
      if (result.translation) {
        embed
          .setThumbnail('attachment://translate.png')
          .setAuthor('commands:translate.googleTranslate', 'attachment://translate.png')
          .addField('commands:translate.original', query)
          .addField('commands:translate.translated', result.translation)
          .attachFiles(new MessageAttachment('src/assets/google-translate.png', 'translate.png'))

        return send(embed)
      } else {
        throw new CommandError('commands:translate.error', { onUsage: false })
      }
    })
  }
}

module.exports = Translate
