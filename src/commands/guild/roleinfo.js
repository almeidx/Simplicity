'use strict';

const { Command, CommandError, Parameters: { RoleParameter }, SimplicityEmbed, Utils } = require('../..');
const { getServerIconURL, checkTick } = Utils;
const moment = require('moment');

class RoleInfo extends Command {
  constructor(client) {
    super(client);
    this.aliases = ['ri', 'roleinformation'];
    this.category = 'guild';
    this.requirements = { argsRequired: true, guildOnly: true };
    this.responses = { argsRequired: 'commands:roleinfo.noArgs' };
  }

  async run({ author, client, emoji, guild, query, send, t }) {
    const role = await RoleParameter.parse(query, {
      errors: { missingError: 'errors:invalidRole' },
      required: true,
    }, { client, guild });
    if (!role || role.id === guild.id) throw new CommandError('errors:invalidRole');

    const totalRoles = guild.roles.filter((r) => r.id !== guild.id).size;

    const embed = new SimplicityEmbed({ author, emoji, t })
      .setThumbnail(getServerIconURL(guild))
      .addField('» $$commands:roleinfo.name', role.name, true)
      .addField('» $$commands:roleinfo.id', role.id, true);

    if (role.hexColor !== '#000000') embed.addField('» $$commands:roleinfo.color', role.hexColor, true);

    const roleMembers = role.members;
    const members = role.members && `${roleMembers.first(15).join(', ')}${roleMembers.size > 15 ?
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
