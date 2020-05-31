'use strict';

const Command = require('@command/Command');
const SimplicityEmbed = require('@discord/SimplicityEmbed');
const { BOT_DEFAULT_PERMISSIONS } = require('@util/Constants');
const { convertDateLang, getDevs } = require('@util/Util');
const { version } = require('discord.js');

class BotInfo extends Command {
  constructor(client) {
    super(client, 'botinfo', {
      aliases: ['bi', 'botinformation', 'infobot', 'informationbot', 'stats', 'statistics'],
      category: 'bot',
      cooldown: 10000,
      requirements: { clientPermissions: ['EMBED_LINKS'] },
    });
  }

  async run({ author, client, emoji, guild, prefix, send, t }) {
    const uptime = convertDateLang(t, client.uptime);
    const ram = (process.memoryUsage().heapUsed / 1048576).toFixed(2);
    const inviteLink = await client.generateInvite(BOT_DEFAULT_PERMISSIONS);
    const ping = Math.ceil(guild ? guild.shard.ping : client.ws.ping);

    let devs = getDevs();
    if (devs) {
      devs = devs.filter((id) => client.users.cache.has(id))
        .map((id) => client.users.cache.get(id).tag)
        .sort()
        .join(', ');
    }

    const embed = new SimplicityEmbed({ author, emoji, t })
      .addFields(
        { inline: true, name: '» $$commands:botinfo.ping', value: `${ping}ms` },
        { inline: true, name: '» $$commands:botinfo.users', value: client.users.cache.size },
        { inline: true, name: '» $$commands:botinfo.guilds', value: client.guilds.cache.size },
        { inline: true, name: '» $$commands:botinfo.prefix', value: prefix },
        { inline: true, name: '» $$commands:botinfo.memoryUsage', value: `${ram}mb` },
        { inline: true, name: '» $$commands:botinfo.discordjs', value: version },
        { inline: true, name: '» $$commands:botinfo.node', value: process.versions.node },
        { inline: true, name: '» $$commands:botinfo.commands', value: client.commands.size },
        { inline: true, name: '» $$commands:botinfo.links', value: `[ $$commands:botinfo.inviteBot ](${inviteLink})` },
      );

    if (devs) embed.addField('» $$commands:botinfo.developers', devs);

    embed.addField('» $$commands:botinfo.uptime', uptime);
    return send(embed);
  }
}

module.exports = BotInfo;
