'use strict';

const Command = require('@command/Command');
const SimplicityEmbed = require('@discord/SimplicityEmbed');
const { BOT_DEFAULT_PERMISSIONS } = require('@util/Constants');
const { convertDateLang, getDevs } = require('@util/Util');
const { version } = require('discord.js');

class BotInfo extends Command {
  constructor(client) {
    super(client, {
      aliases: ['bi', 'botinformation', 'infobot', 'informationbot', 'stats', 'statistics'],
      category: 'bot',
      cooldown: 10000,
      name: 'botinfo',
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
      devs = devs.filter((id) => client.users.cache.has(id)).map((id) => client.users.cache.get(id).tag).join(', ');
    }

    const embed = new SimplicityEmbed({ author, emoji, t })
      .addField('» $$commands:botinfo.ping', `${ping}ms`, true)
      .addField('» $$commands:botinfo.users', client.users.cache.size, true)
      .addField('» $$commands:botinfo.guilds', client.guilds.cache.size, true)
      .addField('» $$commands:botinfo.prefix', prefix, true)
      .addField('» $$commands:botinfo.ramUsage', `${ram}mb`, true)
      .addField('» $$commands:botinfo.discordjs', version, true)
      .addField('» $$commands:botinfo.nodejs', process.versions.node, true)
      .addField('» $$commands:botinfo.commands', client.commands.size, true)
      .addField('» $$commands:botinfo.links', `#bot_tag [$$commands:botinfo.inviteBot ](${inviteLink})`, true);

    if (devs) embed.addField('» $$commands:botinfo.developers', devs);

    embed.addField('» $$commands:botinfo.uptime', uptime);
    return send(embed);
  }
}

module.exports = BotInfo;
