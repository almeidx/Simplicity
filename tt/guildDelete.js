const { Embed } = require('../src')
async function guildDelete (guild) {
  await this.database.guilds.remove(guild.id)

  if (process.env.GUILD_LEAVE && this.channels.has(process.env.GUILD_LEAVE)) {
    const channel = this.channels.get(process.env.GUILD_LEAVE)
    const owner = guild.owner

    const embed = new Embed({ guild })
      .setTimestamp()
      .setAuthor(owner.user.tag, owner.user.displayAvatarURL())
      .addField('Guild Name', guild.name, true)
      .addField('Guild ID', guild.id, true)
      .addField('Members | Channels | Emojis', `${guild.memberCount} | ${guild.channels.size} | ${guild.emojis.size}`)
      .setFooter(`Owner ID: ${owner.id}`)
      .setThumbnail(guild.iconURl())

    channel.send(embed)
  }
}

module.exports = guildDelete
