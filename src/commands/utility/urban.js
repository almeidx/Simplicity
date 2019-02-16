const { MessageEmbed } = require('discord.js')
const { Command } = require('../../')
const urban = require('urban')

class Urban extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['urbandictionary', 'urban-dictionary', 'dictionary', 'definition', 'def', 'ud']
    this.category = 'util'
    this.requirements = { argsRequired: true, nsfwChannelOnly: true }
  }
  run ({ author, channel, send, query, emoji, t }) {
    const embed = new MessageEmbed()
    if (!channel.nsfw) {
      embed.setDescription(t('errors:nsfwChannel'))
      return send(embed, { error: true })
    }
    urban(query).first(function (results) {
      if (!results) {
        embed.setDescription(t('commands:urban.noDef'))
        return send(embed, { error: true })
      } else {
        embed.setTitle(query)
          .setDescription(results.definition.slice(0, 2048).replace(/\[/g, '').replace(/]/g, ''))
          .addField(t('commands:urban.example'), results.example.slice(0, 1024).replace(/\[/g, '').replace(/]/g, ''))
        send(embed)
      }
    })
  }
}
module.exports = Urban
