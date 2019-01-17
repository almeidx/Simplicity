const { MessageEmbed } = require('discord.js')
const { Command } = require('../..')

class Prefix extends Command {
  constructor (client) {
    super(client)
    this.category = 'bot'
    this.requirements = { argsRequired: true, permissions: ['MANAGE_ROLES'] }
  }

  async run ({ guild, query, send, t }) {
    const embed = new MessageEmbed()
    if (query.length > 10) {
      embed.setTitle('errors:denied')
      embed.setDescription('commands:help.multiCharacters')
      return send(embed)
    }

    try {
      const data = await this.client.database.guilds.edit(guild.id, { prefix: query })
      embed.setTitle('commands:prefix.done')
      embed.setDescription(t('commands:prefix.sucess', { prefix: query }))
      send(embed)
    } catch (err) {
      embed.setTitle('commands:prefix.oops')
      embed.setDescription('commands:prefix.failed')
      send(embed)
      console.log(err)
    }
  }
}

module.exports = Prefix
