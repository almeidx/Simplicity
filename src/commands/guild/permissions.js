const { Command, Constants, Parameters, SimplicityEmbed, CommandError, Utils } = require('../..')
const { User } = require('discord.js')
const { MANAGER_PERMISSIONS } = Constants
const { UserParameter, RoleParameter } = Parameters
const { getServerIconURL, checkTick } = Utils

const ParameterOptions = {
  checkStartsWith: false,
  checkEndsWith: false
}

class Permissions extends Command {
  constructor (client) {
    super(client)
    this.aliases = [ 'perms', 'perm', 'permission' ]
    this.category = 'guild'
    this.requirements = {
      guildOnly: true }
  }

  async run ({ author, emoji, guild, query, send, t }) {
    const Guild = { guild }
    const m = (!query && author) || await RoleParameter.search(query, Guild, ParameterOptions) || await UserParameter.search(query, Guild)

    if (!m)
      throw new CommandError('commands:permissions.error')

    const isUser = m instanceof User
    const avatar = isUser ? m.displayAvatarURL() : getServerIconURL(guild)
    const name = isUser ? m.tag : m.name
    const title = isUser ? 'commands:permissions.author' : 'commands:permissions.role'

    const embed = new SimplicityEmbed({ author, emoji, t })
      .setAuthor(title, avatar, null, { name })

    const permissions = !isUser ? m.permissions : guild.member(m).permissions
    for (const p of MANAGER_PERMISSIONS)
      embed.addField(`permissions:${p}`, checkTick(permissions.has(p)), true)

    let r
    const yEmoji = emoji('TICK_YES')
    const nEmoji = emoji('TICK_NO')
    const yResult = embed.fields.filter(f => f.value === yEmoji).length
    const nResult = embed.fields.filter(f => f.value === nEmoji).length

    if ((Math.abs((yResult / embed.fields.length) * 100)).toFixed(2) >= 70) r = 'GREEN'
    if ((Math.abs((nResult / embed.fields.length) * 100)).toFixed(2) >= 70) r = 'RED'
    if (yResult === nResult) r = null
    if (r) embed.setColor(r)

    return send(embed)
  }
}

module.exports = Permissions
