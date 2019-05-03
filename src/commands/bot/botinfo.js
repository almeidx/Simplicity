const { Command, SimplicityEmbed, Utils } = require('../../')
const { version } = require('discord.js')

class BotInfo extends Command {
  constructor (client) {
    super(client)
    this.aliases = [ 'bi' ]
    this.category = 'bot'
    this.requirements = { clientPermissions: [ 'EMBED_LINKS' ] }
  }

  run ({ author, client, emoji, guild, prefix, send, t }) {
    const UPTIME = Utils.convertDateLang(t, client.uptime)
    const RAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)

    const inviteLink = `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=379968`
    const ownersId = process.env.DEVS_IDS && process.env.DEVS_IDS.split(', ')
    const OWNERS = ownersId && ownersId.filter(id => client.users.has(id)).map(id => client.users.get(id).tag).join(', ')

    const embed = new SimplicityEmbed({ author, guild, t, emoji })
      .addField('» $$commands:botinfo.ping', `${Math.round(guild.shard.ping)}ms`, true)
      .addField('» $$commands:botinfo.users', this.client.users.size, true)
      .addField('» $$commands:botinfo.guilds', this.client.guilds.size, true)
      .addField('» $$commands:botinfo.prefix', prefix, true)
      .addField('» $$commands:botinfo.ramUsage', `${RAM} mb`, true)
      .addField('» $$commands:botinfo.discordjs', version, true)
      .addField('» $$commands:botinfo.nodejs', process.versions.node, true)
      .addField('» $$commands:botinfo.commands', this.client.commands.size, true)
      .addField('» $$commands:botinfo.links', `#bot_tag [$$commands:botinfo.inviteBot ](${inviteLink})`, true)

    if (OWNERS)
      embed.addField('» $$commands:botinfo.developers', OWNERS)

    embed.addField('» $$commands:botinfo.uptime', UPTIME)
    return send(embed)
  }
}

module.exports = BotInfo
