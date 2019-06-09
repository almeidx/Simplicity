const { Command, Parameters, SimplicityEmbed, Utils } = require('../..')
const { GuildParameter } = Parameters
const { getServerIconURL } = Utils
const moment = require('moment')
const GuildParameterOptions = {
  required: true,
  checkIncludes: true
}

class ServerInfo extends Command {
  constructor (client) {
    super(client)
    this.aliases = [ 'si', 'server', 'svinfo', 'sv', 'guild', 'serverinformation', 'svinformation' ]
    this.category = 'guild'
  }

  async run ({ author, channel, client, emoji, guild, query, send, t }) {
    const Guild = await GuildParameter.search(query, { client, guild }, GuildParameterOptions)

    await Guild.members.fetch()
    const totalMembers = Guild.memberCount
    const onlineMembers = Guild.members.filter(m => m.user.presence.status !== 'offline').size
    const offlineMembers = Guild.members.filter(m => m.user.presence.status === 'offline').size

    const totalChannels = Guild.channels.filter(channel => channel.type === 'text' || channel.type === 'voice').size
    const textChannels = Guild.channels.filter(channel => channel.type === 'text').size
    const voiceChannels = Guild.channels.filter(channel => channel.type === 'voice').size

    const totalRoles = Guild.roles && Guild.roles.filter(r => r.id !== Guild.id).size
    const roles = Guild.roles && Guild.roles.sort((a, b) => b.position - a.position).map(r => r).slice(0, -1)
    const rolesClean = roles && roles.map(r => r.name || r.toString())

    const GuildIconURL = getServerIconURL(Guild)
    const emojis = Guild.emojis && Guild.emojis.size
    const owner = (Guild.owner && Guild.owner.user.tag) || t('commands:serverinfo.unknown')
    const date = moment(Guild.createdAt)

    const boostTier = Guild.premiumTier
    const boosters = Guild.premiumSubscriptionCount

    const embed = new SimplicityEmbed({ author, Guild, t })
      .setThumbnail(GuildIconURL)
      .addField('» $$commands:serverinfo.name', Guild.name, true)
      .addField('» $$commands:serverinfo.id', Guild.id, true)
      .addField('» $$commands:serverinfo.owner', owner, true)
      .addField('» $$commands:serverinfo.emotes', emojis, true)

    if (roles.length && roles.length <= 5)
      embed.addField('» $$commands:serverinfo.roles', rolesClean.join(', '), true, { totalRoles })
    else
      embed.addField('» $$commands:serverinfo.totalRoles', totalRoles, true)

    if (boostTier && boosters)
      embed.addField('» $$commands:serverinfo.boostTier', 'commands:serverinfo.tier', true, {}, { boostTier })

    embed
      .addField('» $$commands:serverinfo.members', 'commands:serverinfo.onlineOffline', true, { totalMembers }, { onlineMembers, offlineMembers })
      .addField('» $$commands:serverinfo.channels', 'commands:serverinfo.textVoice', true, { totalChannels }, { textChannels, voiceChannels })
      .addField('» $$commands:serverinfo.created', `${date.format('LLL')} (${date.fromNow()})`)
      .addField('» $$commands:serverinfo.verificationLevel', `commands:serverinfo.verificationDetails.${Guild.verificationLevel}`, true, { level: Guild.verificationLevel })

    const message = await send(embed)

    const permissions = channel.permissionsFor(Guild.me)
    const roleRestriction = rolesClean && rolesClean.length > 5

    if (permissions.has('ADD_REACTIONS') && roleRestriction) {
      const role = {
        emoji: emoji('ROLES', { id: true }),
        embed: createEmbedRoles(roles, Guild, { author, t })
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

function createEmbedRoles (roles, Guild, embedOptions) {
  const guildIconURL = getServerIconURL(Guild)
  return new SimplicityEmbed(embedOptions)
    .setAuthor('$$commands:serverinfo.roles', guildIconURL, '', { totalRoles: roles.length })
    .setDescription(roles.join('\n'))
    .setColor(process.env.COLOR)
}

module.exports = ServerInfo
