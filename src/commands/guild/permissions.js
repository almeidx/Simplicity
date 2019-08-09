'use strict';

const { User } = require('discord.js');
const { Command, CommandError, Constants, Parameters, SimplicityEmbed, Utils } = require('../../');
const { UserParameter, RoleParameter } = Parameters;
const { getServerIconURL, checkTick } = Utils;
const { MANAGER_PERMISSIONS } = Constants;

const ParameterOptions = {
  checkStartsWith: false,
  checkEndsWith: false,
};

class Permissions extends Command {
  constructor(client) {
    super(client);
    this.aliases = ['perms', 'perm', 'permission'];
    this.category = 'guild';
    this.requirements = { guildOnly: true };
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
