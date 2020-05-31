'use strict';

const { Command, SimplicityEmbed } = require('@structures');
const { MANAGER_PERMISSIONS } = require('@util/Constants');
const { getServerIconURL, checkTick } = require('@util/Util');
const { GuildMember } = require('discord.js');

class Permissions extends Command {
  constructor(client) {
    super(client, 'permissions', {
      aliases: ['perms', 'perm', 'permission'],
      category: 'guild',
      requirements: { guildOnly: true },
    }, [
      {
        acceptBot: true,
        acceptSelf: true,
        missingError: 'commands:permissions.error',
        required: false,
        type: 'member|role',
      },
    ]);
  }

  run({ author, emoji, guild, member: guildMember, send, t }, victim = guildMember) {
    const avatar = victim instanceof GuildMember ?
      victim.user.displayAvatarURL({ dynamic: true }) :
      getServerIconURL(guild);
    const name = victim instanceof GuildMember ? victim.user.tag : victim.name;
    const title = victim instanceof GuildMember ? '$$commands:permissions.author' : '$$commands:permissions.role';

    const embed = new SimplicityEmbed({ author, emoji, t })
      .setAuthor(title, avatar, null, { name });

    for (const p of MANAGER_PERMISSIONS) {
      embed.addField(`$$permissions:${p}`, checkTick(victim.permissions.has(p)), true);
    }

    const color = this.resolveColor(embed, emoji);
    if (color) embed.setColor(color);

    return send(embed);
  }

  resolveColor(embed, emoji) {
    const yResult = embed.fields.filter((f) => f.value === emoji('TICK_YES')).length;
    const nResult = embed.fields.filter((f) => f.value === emoji('TICK_NO')).length;
    if (Math.abs(yResult / embed.fields.length * 100).toFixed(2) >= 70) {
      return 'GREEN';
    } else if (Math.abs(nResult / embed.fields.length * 100).toFixed(2) >= 70) {
      return 'RED';
    }
  }
}

module.exports = Permissions;
