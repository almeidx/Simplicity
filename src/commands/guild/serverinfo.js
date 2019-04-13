const { Command, SimplicityEmbed, Utils } = require('../..')
const moment = require('moment')

class ServerInfo extends Command {
  constructor (client) {
    super(client)
    this.aliases = [ 'si', 'server', 'svinfo', 'sv', 'guild', 'serverinformation', 'svinformation' ]
    this.category = 'guild'
  }

  async run ({ author, channel, emoji, guild, send, t }) {
    // MEMBERS
    await guild.members.fetch()
    const totalMembers = guild.memberCount
    const onlineMembers = guild.members.filter(m => m.user.presence.status !== 'offline').size
    const offlineMembers = guild.members.filter(m => m.user.presence.status === 'offline').size

    // CHANNELS
    const totalChannels = guild.channels.filter(channel => channel.type === 'text' || channel.type === 'voice').size
    const textChannels = guild.channels.filter(channel => channel.type === 'text').size
    const voiceChannels = guild.channels.filter(channel => channel.type === 'voice').size

    // ROLES
    const totalRoles = guild.roles && guild.roles.filter(r => r.id !== guild.id).size
    const roles = guild.roles && guild.roles.sort((a, b) => b.position - a.position).map(r => r).slice(0, -1)
    const rolesClean = roles && roles.map(r => r.name || r.toString())

    const guildIconURL = Utils.getServerIconURL(guild)
    const emojis = guild.emojis && guild.emojis.size
    const owner = (guild.owner && guild.owner.user.tag) || t('commands:serverinfo.unknown')
    const date = moment(guild.createdAt)

    const embed = new SimplicityEmbed({ author, guild, t })
      .setThumbnail(guildIconURL)
      .addField('» $$commands:serverinfo.name', guild.name, true)
      .addField('» $$commands:serverinfo.id', guild.id, true)
      .addField('» $$commands:serverinfo.owner', owner, true)
      .addField('» $$commands:serverinfo.emotes', emojis, true)

    if (roles.length <= 5) embed.addField('» $$commands:serverinfo.roles', rolesClean.join(', '), true, { totalRoles })
    else embed.addField('» $$commands:serverinfo.totalRoles', totalRoles, true)

    embed
      .addField('» $$commands:serverinfo.members', 'commands:serverinfo.onlineOffline', true, { totalMembers }, { onlineMembers, offlineMembers })
      .addField('» $$commands:serverinfo.channels', 'commands:serverinfo.textVoice', true, { totalChannels }, { textChannels, voiceChannels })
      .addField('» $$commands:serverinfo.created', `${date.format('LLL')} (${date.fromNow()})`)
      .addField('» $$commands:serverinfo.verificationLevel', `commands:serverinfo.verificationDetails.${guild.verificationLevel}`, true, { level: guild.verificationLevel })

    const message = await send(embed)

    const permissions = channel.permissionsFor(guild.me)
    const roleRestriction = rolesClean && rolesClean.length > 5

    if (permissions.has('ADD_REACTIONS') && roleRestriction) {
      const role = {
        emoji: emoji('ROLES', { id: true }),
        embed: createEmbedRoles(roles, guild, { author, t })
      }
      await message.react(role.emoji)

      const serverinfoEmoji = emoji('BACK', { id: true })
      await message.react(serverinfoEmoji)

      const filter = (r, u) => r.me && author.id === u.id
      const collector = await message.createReactionCollector(filter, { errors: ['time'], time: 30000 })

      collector.on('collect', async ({ emoji, users, message }) => {
        const name = emoji.id || emoji.name
        const checkEmbed = (e) => e.author.name === message.embeds[0].author.name

        if (permissions.has('MANAGE_MESSAGES')) await users.remove(author.id)
        if (name === serverinfoEmoji && !checkEmbed(embed)) await message.edit(embed)
        if (role && name === role.emoji && !checkEmbed(role.embed)) await message.edit(role.embed)
      })

      collector.on('end', async () => {
        if (message && permissions.has('MANAGE_MESSAGES')) await message.reactions.removeAll().catch(() => null)
      })
    }
  }
}

function createEmbedRoles (roles, guild, embedOptions) {
  const guildIconURL = Utils.getServerIconURL(guild)
  return new SimplicityEmbed(embedOptions)
    .setAuthor('$$commands:serverinfo.roles', guildIconURL, '', { totalRoles: roles.length })
    .setDescription(roles.join('\n'))
    .setColor(process.env.COLOR)
}

module.exports = ServerInfo
