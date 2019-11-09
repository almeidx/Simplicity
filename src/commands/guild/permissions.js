'use strict';

const { Command, CommandError, SimplicityEmbed } = require('@structures');
const { UserParameter, RoleParameter } = require('@parameters');
const { getServerIconURL, checkTick } = require('@utils/Utils');
const { MANAGER_PERMISSIONS } = require('@utils/Constants');
const { User } = require('discord.js');

const ParameterOptions = {
  checkStartsWith: false,
  checkEndsWith: false,
};

class Permissions extends Command {
  constructor(client) {
    super(client, {
      name: 'permissions',
      aliases: ['perms', 'perm', 'permission'],
      category: 'guild',
      requirements: {
        guildOnly: true,
      },
    });
  }

  async run({ author, emoji, guild, query, send, t }) {
    const victim = (!query && author) || await RoleParameter.search(query, { guild }, ParameterOptions) ||
      await UserParameter.search(query, { guild });
    if (!victim) throw new CommandError('commands:permissions.error');

    const isUser = victim instanceof User;
    const avatar = isUser ? victim.displayAvatarURL() : getServerIconURL(guild);
    const name = isUser ? victim.tag : victim.name;
    const title = isUser ? 'commands:permissions.author' : 'commands:permissions.role';

    const embed = new SimplicityEmbed({ author, emoji, t })
      .setAuthor(title, avatar, null, { name });

    const permissions = isUser ? guild.member(victim).permissions : victim.permissions;
    for (const p of MANAGER_PERMISSIONS) embed.addField(`permissions:${p}`, checkTick(permissions.has(p)), true);

    let color;
    const yResult = embed.fields.filter((f) => f.value === emoji('TICK_YES')).length;
    const nResult = embed.fields.filter((f) => f.value === emoji('TICK_NO')).length;
    if (Math.abs(yResult / embed.fields.length * 100).toFixed(2) >= 70) color = 'GREEN';
    if (Math.abs(nResult / embed.fields.length * 100).toFixed(2) >= 70) color = 'RED';
    if (yResult === nResult) color = null;
    if (color) embed.setColor(color);

    return send(embed);
  }
}

module.exports = Permissions;
