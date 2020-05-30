'use strict';

const { Command, SimplicityEmbed, CommandError } = require('@structures');

const addAliases = ['add', 'addrole', 'a', 'g', 'give', 'giverole'];
const removeAliases = ['remove', 'removerole', 'r', 'take', 'takerole'];

class Role extends Command {
  constructor(client) {
    super(client, 'role', {
      aliases: ['r'],
      args: [
        {
          missingError: 'commands:role.noArgs',
          required: true,
          type: 'string',
          whitelist: [...addAliases, ...removeAliases],
        },
        {
          acceptSelf: true,
          required: false,
          type: 'member',
        },
        {
          authorHasHigh: true,
          clientHasHigh: true,
          required: true,
          type: 'role',
        },
        ...new Array(9).fill({
          authorHasHigh: true,
          clientHasHigh: true,
          required: false,
          type: 'role',
        }),
      ],
      category: 'guild',
    });
  }

  async run({ author, member: guildMember, t, channel }, option, member = guildMember, ...Xroles) {
    option = addAliases.includes(option.toLowerCase()) ? 'add' : 'remove';

    const roles = Xroles.filter((role) => role);

    for (const role of roles) {
      if (option === 'add') {
        if (member.roles.cache.has(role.id)) {
          throw new CommandError('commands:role.alreadyHasRole', { member: `${member}`, role: `${role}` });
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
        if (!member.roles.cache.has(role.id)) {
          throw new CommandError('commands:role.hasNotRole', { member: `${member}`, role: `${role}` });
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
    const strRoles = roles.map((role) => `${role}` || role.name);
    const msg = option === 'add' ? 'commands:role.added' : 'commands:role.removed';
    embed.setDescription(msg, { author, count: roles.length, member, roles: strRoles.join(', ') });

    return channel.send(embed);
  }
}

module.exports = Role;
