const { MessageEmbed, MessageAttachment } = require('discord.js')
const translate = require('node-google-translate-skidz')
module.exports = {
  run: async function (message, client, args) {
    if (args.length === 0) {
      const embed = new MessageEmbed()
        .setTimestamp()
        .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL({ size: 2048 }))
        .setColor('RED')
        .setTitle('Missing Parameters!')
        .setDescription(`Usage: **${process.env.PREFIX}translate [text]**`)
      message.channel.send(embed)
    };
    let text = args.join(' ')
    translate({
      text: text,
      target: 'en'
    }, function (res) {
      if (res.translation) {
        let embed = new MessageEmbed()
          .setColor('4f8bf5')
          .setTimestamp()
          .setThumbnail('attachment://translate.png')
          .addField('Original', text, true)
          .addField('Translated', res.translation)
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
