'use strict';

const { Command, SimplicityEmbed, CommandError } = require('@structures');

const addAliases = ['add', 'addrole', 'a', 'g', 'give', 'giverole'];
const removeAliases = ['remove', 'removerole', 'r', 'take', 'takerole'];

class Role extends Command {
  constructor(client) {
    super(client, {
      name: 'role',
      category: 'guild',
      aliases: ['r'],
    }, [
      {
        type: 'string',
        required: true,
        whitelist: [...addAliases, ...removeAliases],
        missingError: 'commands:role.noArgs',
      },
      {
        type: 'member',
        required: false,
      },
      {
        type: 'role',
        required: true,
        clientHasHigh: true,
        authorHasHigh: true,
      },
      ...new Array(9).fill({
        type: 'role',
        required: false,
        clientHasHigh: true,
        authorHasHigh: true,
      }),
    ]);
  }

  async run({ author, member: guildMember, t, channel }, option, member = guildMember, ...Xroles) {
    option = addAliases.includes(option.toLowerCase()) ? 'add' : 'remove';

    const roles = Xroles.filter((role) => role);

    for (const role of roles) {
      if (option === 'add') {
        if (member.roles.has(role.id)) {
          throw new CommandError('commands:role.alreadyHasRole', { role: role.toString(), member: member.toString() });
        }

        try {
          const reason = t('commands:role.reasonAdd', { author: author.tag, user: member.user.tag });
          // eslint-disable-next-line no-await-in-loop
          await member.roles.add(role.id, { reason });
        } catch (error) {
          throw new CommandError('commands:role.failedAdd');
        }
      }

      if (option === 'remove') {
        if (!member.roles.has(role.id)) {
          throw new CommandError('commands:role.hasNotRole', { role: role.toString(), member: member.toString() });
        }

        try {
          const reason = t('commands:role.reasonRemove', { author: author.tag, user: member.user.tag });
          // eslint-disable-next-line no-await-in-loop
          await member.roles.remove(role.id, { reason });
        } catch (error) {
          throw new CommandError('commands:role.failedRemove');
        }
      }
    }

    const embed = new SimplicityEmbed({ author, t });
    const strRoles = roles.map((role) => role.toString() || role.name);
    const msg = option === 'add' ? 'commands:role.added' : 'commands:role.removed';
    embed.setDescription(msg, { roles: strRoles.join(', '), count: roles.length, author, member });

    return channel.send(embed);
  }
}

module.exports = Role;
