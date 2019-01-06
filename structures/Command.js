const { MessageEmbed } = require('discord.js')
const { PERMISSIONS } = require('../utils/Constants')
class Command {
  constructor (name, client) {
    this.name = name
    this.client = client
    this.aliases = []
    this.description = 'No Description'
    this.usage = 'No example'
    this.argsRequired = false
    this.permissions = []
    this.clientPermissions = []
  }
  run () {}
  _run (message, args) {
    if (this.argsRequired && args.length === 0) {
      return message.channel.send('Invalid Parameters!')
    }
    let ClientPermissions = this.clientPermissions.filter(p => !message.guild.me.permissions.has(p))
    if (ClientPermissions.length !== 0) {
      let permissions = ClientPermissions.map(p => PERMISSIONS[p]).join(', ')
      let embed = new MessageEmbed()
        .setTitle('Missing Permissions!')
        .setDescription(`I require the ${permissions} permission in order to execute this command!`)
        .setColor('RED')
        .setFooter(`Executed by: ${message.author.tag}`, message.author.displayAvatarURL({ size: 2048 }))
        .setTimestamp()
      return message.channel.send(embed)
    }
    let UserPermissions = this.permissions.filter(p => !message.member.permissions.has(p))
    if (UserPermissions.length !== 0) {
      let permissions = ClientPermissions.map(p => PERMISSIONS[p]).join(', ')
      let embed = new MessageEmbed()
        .setTitle('Missing Permissions!')
        .setDescription(`You require the ${permissions} permission in order to execute this command!`)
        .setColor('RED')
        .setFooter(`Executed by: ${message.author.tag}`, message.author.displayAvatarURL({ size: 2048 }))
        .setTimestamp()
      return message.channel.send(embed)
    }
    this.run(message, args)
  }
}

module.exports = Command
