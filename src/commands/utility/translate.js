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
  run ({ message, args, t }) {
    let text = args.join(' ')
    translate({
      text: text,
      target: 'en'
    }, function (res) {
      if (res.translation) {
        let embed = new MessageEmbed()
          .setColor(process.env.COLOR)
          .setTimestamp()
          .setThumbnail('attachment://translate.png')
          .setAuthor(t('commands:translate.googleTranslate'), 'attachment://translate.png')
          .addField(t('commands:translate.original'), text, true)
          .addField(t('commands:translate.translated'), res.translation, true)
          .setFooter(`${t('utils:footer')} ${message.author.tag}`, message.author.displayAvatarURL({ size: 2048 }))
          .attachFiles(new MessageAttachment('src/assets/google-translate.png', 'translate.png'))
        message.channel.send(embed)
      } else {
        const embed = new MessageEmbed()
          .setColor('RED')
          .setTitle(t('errors:general'), 'Try again later.')
          .setFooter(`${t('general:footer')} ${message.author.tag}`, message.author.displayAvatarURL({ size: 2048 }))
          .setTimestamp()
        message.channel.send(embed)
      };
    })
  }
}

module.exports = Translate
