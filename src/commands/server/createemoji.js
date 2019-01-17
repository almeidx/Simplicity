const { MessageEmbed } = require('discord.js')
const { Command } = require('../..')

class CreateEmoji extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['createmoji', 'addemoji']
    this.category = 'server'
    this.requirements = { argsRequired: true, permissions: ['MANAGE_EMOJIS'], clientPermissions: ['MANAGE_EMOJIS'] }
  }
  run ({ message, args }) {
    let embed = new MessageEmbed()
      .setFooter(`Executed by: ${message.author.tag}`, message.author.displayAvatarURL({ size: 2048 }))
      .setAuthor(message.author.tag, message.author.displayAvatarURL({ size: 2048 }))
      .setColor('RED')
    if (args.length <= 1) {
      embed.setTitle('Denied!')
        .setDescription('You either didn\'t specify the link of the emoji or the name of it.')
      return message.channel.send(embed)
    }
    const name = args.shift()
    const url = args.join('')
    if (!name.length >= 32) {
      embed.setTitle('Denied!')
        .setDescription('The name for the emoji you provided was too big.')
      return message.channel.send(embed)
    } else if (!name.length >= 2) {
      embed.setTitle('Denied!')
        .setDescription('The name for the emoji you provided was too short.')
      return message.channel.send(embed)
    } else if (!name.match('(^[a-zA-Z0-9_]*$)')) {
      embed.setTitle('Denied!')
        .setDescription('Please, note that the emoji name can only have letters, numbers or underscores.')
      return message.channel.send(embed)
    } else if (url.startsWith('http://' || 'https://') &&
        url.includes('.png' || '.gif' || '.webp' || '.jpg' || '.jpeg')) {
      embed.setTitle('Denied!')
        .setDescription('The URL you provided was not a valid url.')
      return message.channel.send(embed)
    } else {
      message.guild.emojis.create(url, name)
        .then(e => {
          embed.setTitle('Emoji Created!')
            .setDescription(`\`${e.name}\``)
            .setImage(url)
            .setColor(process.env.COLOR)
          message.channel.send(embed)
        })
        .catch(err => {
          console.log(err)
          embed.setTitle('Oops!')
            .setDescription('There was an error when creating the emoji.')
          return message.channel.send(embed)
        })
    }
  }
}

module.exports = CreateEmoji
