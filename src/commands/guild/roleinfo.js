const { Command, CommandError, Parameters, SimplicityEmbed, Utils } = require('../..')
const { RoleParameter } = Parameters
const { getServerIconURL } = Utils

class RoleInfo extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['ri', 'roleinformation']
    this.category = 'guild'
    this.requirements = { argsRequired: true }
    this.responses = { argsRequired: 'commands:roleinfo.noArgs' }
  }

  async run ({ author, client, emoji, guild, query, send, t }) {
    const role = await RoleParameter.parse(query, {
      errors: { missingError: 'errors:invalidRole' },
      required: true
    }, { client, guild })

    if (!role || role.id === guild.id) throw new CommandError('errors:invalidRole')

    const totalRolePositions = guild.roles.filter(r => r.id !== guild.id).size

    const checkTick = (c) => c ? 'TICK_YES' : 'TICK_NO'

    const embed = new SimplicityEmbed({ author, emoji, t })
      .setThumbnail(getServerIconURL(guild))
      .addField('» $$commands:roleinfo.name', role.name, true)
      .addField('» $$commands:roleinfo.id', role.id, true)

    if (role.hexColor !== '#000000') embed.addField('» $$commands:roleinfo.color', role.hexColor, true)

    const size = role.members.size
    const members = role.members && `${role.members.first(15).join(', ')}${size > 15 ? ', ...' : ''}`

    embed
      .addField('» $$commands:roleinfo.position', `${role.position}/${totalRolePositions}`, true)
      .addField('» $$commands:roleinfo.mentionable', `#${checkTick(role.mentionable)}`, true)
      .addField('» $$commands:roleinfo.hoisted', `#${checkTick(role.hoist)}`, true)

    if (members) embed.addField('» $$commands:roleinfo.members', members, true, { size })
    return send(embed)
  }
}

module.exports = RoleInfo
