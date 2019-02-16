const { MessageEmbed } = require('discord.js')
const { Command } = require('../..')

class Config extends Command {
  constructor (client) {
    super(client)
    this.category = 'bot'
    this.requirements = { permissions: ['MANAGE_GUILD'] }
  }
  async run ({ message, guild, query, args, send, prefix, t }) {
    const embed = new MessageEmbed()
    if (query.length === 0) {
      embed.setTitle(t('commands:config.serverConfig'))
        .addField(t('commands:config.channel'), `${prefix}config \`channel\` #channel`)
      return send(embed)
    }
    if (args[0].toLowerCase === ('channel' || 'canal' || 'chan')) {
      const chan = message.mentions.channels.first()
      if (chan) {
        try {
          await this.client.database.guilds.edit(guild.id, { channel: chan.id })
          embed.setTitle('commands:config.done')
            .setDescription(t('commands:config.sucess', { prefix: query }))
          send(embed)
        } catch (err) {
          embed.setTitle('commands:config.oops')
            .setDescription('commands:config.failed')
          send(embed, { error: true })
          console.log(err)
        }
      }
    }
  }
}
module.exports = Config
