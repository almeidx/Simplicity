'use strict';

const { Command, SimplicityEmbed, Utils: { convertDateLang } } = require('../../');
const { version } = require('discord.js');

class BotInfo extends Command {
  constructor(client) {
    super(client, {
      aliases: ['bi'],
      category: 'bot',
      requirements: {
        clientPermissions: ['EMBED_LINKS']
      }
    });
  }

  async run({ author, client, emoji, guild, message, prefix, send, t }) {
    const uptime = convertDateLang(t, client.uptime);
    const RAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

    const inviteLink = await client.generateInvite(
      ['SEND_MESSAGES', 'READ_MESSAGES_HISTORY', 'ADD_REACTIONS', 'USE_EXTERNAL_EMOJIS']
    );
    const ownersId = process.env.DEVS_IDS && process.env.DEVS_IDS.split(',');
    const owners = ownersId &&
      ownersId.filter((id) => client.users.has(id)).map((id) => client.users.get(id).tag).join(', ');

    const embed = new SimplicityEmbed({ author, emoji, guild, t })
      .addField('» $$commands:botinfo.ping', 'commands:botinfo.gettingLatency', true)
      .addField('» $$commands:botinfo.users', client.users.size, true)
      .addField('» $$commands:botinfo.guilds', client.guilds.size, true)
      .addField('» $$commands:botinfo.prefix', prefix, true)
      .addField('» $$commands:botinfo.ramUsage', `${RAM}mb`, true)
      .addField('» $$commands:botinfo.discordjs', version, true)
      .addField('» $$commands:botinfo.nodejs', process.versions.node, true)
      .addField('» $$commands:botinfo.commands', client.commands.size, true)
      .addField('» $$commands:botinfo.links', `#bot_tag [$$commands:botinfo.inviteBot ](${inviteLink})`, true);

    if (owners) embed.addField('» $$commands:botinfo.developers', owners);

    embed.addField('» $$commands:botinfo.uptime', uptime);
    const msg = await send(embed);
    const newEmbed = embed;
    newEmbed.fields[0].value = t('commands:botinfo.latency', {
      latency: Math.ceil(msg.createdTimestamp - message.createdTimestamp),
    });
    msg.edit(newEmbed);
  }
}

module.exports = BotInfo;
