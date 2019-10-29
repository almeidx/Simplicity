'use strict';

const { Command, Constants, SimplicityEmbed, Utils: { convertDateLang, getDevs } } = require('../../');
const { BOT_DEFAULT_PERMISSIONS } = Constants;
const { version } = require('discord.js');

class BotInfo extends Command {
  constructor(client) {
    super(client, {
      name: 'botinfo',
      aliases: ['bi', 'botinformation', 'infobot', 'informationbot', 'stats', 'statistics'],
      category: 'bot',
      cooldown: 10000,
      requirements: {
        clientPermissions: ['EMBED_LINKS'],
      },
    });
  }

  async run({ author, client, emoji, guild, prefix, send, t }) {
    const uptime = convertDateLang(t, client.uptime);
    const ram = (process.memoryUsage().heapUsed / 1048576).toFixed(2);
    const inviteLink = await client.generateInvite(BOT_DEFAULT_PERMISSIONS);
    const ping = Math.ceil(guild ? guild.shard.ping : client.ws.ping);

    let devs = getDevs();
    if (devs) devs = devs.filter((id) => client.users.has(id)).map((id) => client.users.get(id).tag).join(', ');

    const embed = new SimplicityEmbed({ author, emoji, t })
      .addField('» $$commands:botinfo.ping', `${ping}ms`, true)
      .addField('» $$commands:botinfo.users', client.users.size, true)
      .addField('» $$commands:botinfo.guilds', client.guilds.size, true)
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
