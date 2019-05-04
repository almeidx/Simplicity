const { SimplicityListener, SimplicityEmbed, Utils } = require('../../')
const { getServerIconURL } = Utils
const moment = require('moment')

class GuildCreate extends SimplicityListener {
  constructor (client) {
    super(client)
  }

  async on (client, guild) {
    const guildData = await client.database.guilds.get(guild.id)
    if (!guildData) await client.database.guilds.create(guild.id)

    const owner = guild.owner.user
    const date = moment(guild.createdAt)

    this.sendPrivateMessage('guild_join',
      new SimplicityEmbed()
        .setColor('GREEN')
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

module.exports = GuildCreate
