const { MessageEmbed, MessageAttachment } = require('discord.js')
const { Command } = require('../../')
const translate = require('node-google-translate-skidz')

class Translate extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['googletranslate', 'google-translate']
    this.category = 'util'
    this.requirements = { argsRequired: true }
  }

  run ({ author, send, args, t }) {
    const text = args.join(' ')
    const embed = new MessageEmbed()

    translate({ text: text, target: 'en' }, function (result) {
      if (result.translation) {
        embed
          .setThumbnail('attachment://translate.png')
          .setAuthor(t('commands:translate.googleTranslate'), 'attachment://translate.png')
          .addField(t('commands:translate.original'), text, true)
          .addField(t('commands:translate.translated'), result.translation, true)
          .attachFiles(new MessageAttachment('src/assets/google-translate.png', 'translate.png'))

        return send(embed)
      } else {
        return send(embed, { error: true })
      }
    })
  }
}
module.exports = Translate
