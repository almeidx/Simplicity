const { Embed, Loggers } = require('../')
// const wait = require('util').promisify(setTimeout)

function Ready () {
  Loggers.log(['CLIENT', 'READY'], `Logged on ${this.guilds.size} guilds and ${this.users.size} users`)

  this.user.setActivity(`@${this.user.username} help | ${this.users.size} users | ${this.guilds.size} guilds`, { type: 'WATCHING' })

  const embed = new Embed()
    .setDescription(`Logged on ${this.guilds.size} guilds with ${this.users.size} users`)
    .setTimestamp()
    .setColor('GREEN')
    .setFooter(this.user.tag, this.user.displayAvatarURL())

  if (process.env.CHANNEL_LOG_START && this.channels.has(process.env.CHANNEL_LOG_START)) {
    this.channels.get(process.env.CHANNEL_LOG_START).send(embed)
  }

  /* const invites = {}
   * wait(1000)
   * this.guilds.forEach(guild => {
   * if (guild.me.hasPermission('MANAGE_GUILD')) {
   *   guild.fetchInvites()
   *     .then(guildInvites => {
   *       invites[guild.id] = guildInvites
   *     })
   * }
   * })
   * module.exports = invites
  */
}

module.exports = Ready
