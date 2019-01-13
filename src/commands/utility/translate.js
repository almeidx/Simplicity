const { MessageEmbed, MessageAttachment } = require('discord.js')
const { Command } = require('../../')
const translate = require('node-google-translate-skidz')

class Translate extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['googletranslate', 'google-translate']
    this.description = 'This command translates something to English.'
    this.usage = `Usage: **${process.env.PREFIX}translate [text]**`
    this.category = 'Utility'
    this.argsRequired = true
  }
  run (message, args) {
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
          .setAuthor('Google Translate', 'attachment://translate.png')
          .addField('Original', text, true)
          .addField('Translated', res.translation, true)
          .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL({ size: 2048 }))
          .attachFiles(new MessageAttachment('assets/google-translate.png', 'translate.png'))
        message.channel.send(embed)
      } else {
        const embed = new MessageEmbed()
          .setColor('RED')
          .addField('Something wen\'t wrong!', 'Try again later.')
          .setFooter(`Resquested by: ${message.author.tag}`, message.author.displayAvatarURL({ size: 2048 }))
          .setTimestamp()
        message.channel.send(embed)
      };
    })
  }
}

module.exports = Translate
