'use strict';

const i18next = require('i18next');

const { EMOJIS: { STARBOARD } } = require('./Constants');
const SimplicityEmbed = require('../structures/discord/SimplicityEmbed');

async function StarboardHandler(client, reaction, user) {
  const { emoji, users } = reaction;
  const message = await reaction.message.fetch();

  if (STARBOARD !== emoji.name || user.id === message.author.id) return;

  const guildData = client.database && await client.database.guilds.get(message.guild.id);
  const channelId = guildData && guildData.starboard;
  const channel = channelId && message.channel.guild.channels.get(channelId);

  if (channel) {
    const reactionsSize = users.filter((u) => u.id !== message.author.id).size;

    // search embed exists
    const messages = await channel.messages.fetch({ limit: 100 });
    const found = messages.find((msg) =>
      msg.author.id === client.user.id &&
      msg.embeds.length &&
      msg.embeds[0].footer &&
      msg.embeds[0].footer.text === message.id
    );
    // delete message if users reaction = 0
    if (reactionsSize === 0) {
      if (found) return found.delete();
      else return;
    }

    const language = (guildData && guildData.lang) || process.env.DEFAULT_LANG;
    const t = i18next.getFixedT(language);

    const image = message.attachments.size > 0 ? message.attachments.first().url : null;

    const embed = new SimplicityEmbed({ author: message.author, t })
      .setTitle(`${STARBOARD} ${reactionsSize}`)
      .addField('$$common:starboardJumpToMessage', `[ $$common:clickHere ](${message.url})`)
      .setFooter(message.id)
      .setColor('YELLOW');

    if (message.cleanContent.length) embed.addField('$$common:message', message.cleanContent);
    if (image) embed.setImage(image);

    if (found) found.edit({ embed });
    else channel.send(embed);
  }
}


module.exports = StarboardHandler;
