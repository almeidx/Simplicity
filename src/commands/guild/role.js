const { Command, CommandError, Parameters, SimplicityEmbed } = require('../..')
const { MemberParameter, RoleParameter } = Parameters

const ParameterOptions = {
  checkIncludes: false,
  required: false,
  canBeGuildOwner: true,
  canBeAuthor: true,
  errors: {
    missingError: 'errors:invalidUser'
  }
}

class Role extends Command {
  constructor (client) {
    super(client, {
      name: 'role',
      aliases: [ 'addrole', 'removerole', 'ar', 'rr' ],
      category: 'guild',
      requirements: {
        argsRequired: true
      },
      responses: {
        argsRequired: 'commands:role.noArgs'
      }
    })
  }

  async run ({ args, author, client, guild, member: memberAuthor, send, t }) {
    const member = await MemberParameter.parse(args.shift(), ParameterOptions, {
      memberAuthor,
      commandName: this.name,
      author,
      guild
    })
    const role = await RoleParameter.parse(args.join(' '), {
      errors: { missingError: 'errors:invalidRole' },
      required: true
    }, { client, guild })

    const embed = new SimplicityEmbed({ author, t })

    if (!member.roles.has(role.id)) {
      const reason = t('commands:role.reasonAdd', { author: author.tag, user: member.user.tag })
      member.roles.add(role.id, { reason }).catch(() => {
        throw new CommandError('commands:role.failedAdd')
      })
      embed
        .setDescription('commands:role.added', { role, author, member })
      return send(embed)
    } else {
      const reason = t('commands:role.reasonRemove', { author: author.tag, user: member.user.tag })
      member.roles.remove(role.id, { reason }).catch(() => {
        throw new CommandError('commands:role.failedRemove')
      })
      embed
        .setDescription('commands:role.removed', { role: role.name || role.toString(), author, member })
      return send(embed)
    }
  }
}

module.exports = Role
