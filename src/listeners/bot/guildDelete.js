const { SimplicityListener, SimplicityEmbed, Utils } = require('../../')
const { getServerIconURL } = Utils
const moment = require('moment')

class GuildDelete extends SimplicityListener {
  constructor (client) {
    super(client)
  }

  async on (client, guild) {
    const guildData = await client.database.guilds.get(guild.id)
    if (guildData)
      await client.database.guilds.remove(guild.id)

    const owner = guild.owner.user
    const date = moment(guild.createdAt)

    this.sendPrivateMessage('guild_leave',
      new SimplicityEmbed()
        .setColor('RED')
        .setAuthor(owner.tag, owner.displayAvatarURL())
        .addField('» Guild Name', guild.name, true)
        .addField('» Guild ID', guild.id, true)
        .addField('» Total Members', guild.memberCount, true)
        .addField('» Owner', `${owner} (${owner.id})`)
        .addField('» Created At', `${date.format('LLL')} (${date.fromNow()})}`)
        .setFooter(client.user.tag)
        .setThumbnail(getServerIconURL(guild))
        .setTimestamp())
  }
}

module.exports = GuildDelete
