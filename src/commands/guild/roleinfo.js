'use strict';

const { Command, SimplicityEmbed } = require('@structures');
const { checkTick } = require('@util/Util');
const moment = require('moment');

class RoleInfo extends Command {
  constructor(client) {
    super(client, 'roleinfo', {
      aliases: ['ri', 'roleinformation'],
      args:
        [
          {
            missingError: 'commands:roleinfo.noArgs',
            required: true,
            type: 'role',
          },
        ],
      category: 'guild',
      requirements: { guildOnly: true },
    });
  }

  run({ author, emoji, guild, send, t, language }, role) {
    moment.locale(language);
    const totalRoles = guild.roles.cache.filter((r) => r.id !== guild.id).size;

    const embed = new SimplicityEmbed({ author, emoji, t })
      .setThumbnail(guild)
      .addField('» $$commands:roleinfo.name', role.name, true)
      .addField('» $$commands:roleinfo.id', role.id, true);

    if (role.hexColor !== '#000000') embed.addField('» $$commands:roleinfo.color', role.hexColor, true);

    const roleMembers = role.members && role.members.cache;
    const members = roleMembers && `${roleMembers.first(15).join(', ')}${roleMembers.size > 15 ?
      ` ${t('commands:roleinfo.moreMembers', { size: roleMembers.size - 15 })}` :
      ''}`;
    const date = moment(role.createdAt);

    embed
      .addField('» $$commands:roleinfo.position', `${role.position}/${totalRoles}`, true)
      .addField('» $$commands:roleinfo.mentionable', checkTick(role.mentionable), true)
      .addField('» $$commands:roleinfo.hoisted', checkTick(role.hoist), true)
      .addField('» $$commands:roleinfo.createdAt', `${date.format('LLL')} (${date.fromNow()})`);

    if (members) embed.addField('» $$commands:roleinfo.members', members, true, { size: roleMembers.size });
    return send(embed);
  }
}

module.exports = RoleInfo;
