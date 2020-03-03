'use strict';

const i18next = require('i18next');

const SimplicityEmbed = require('../structures/discord/SimplicityEmbed');
const { EMOJIS: { STARBOARD } } = require('./Constants');

/**
 * Contains various starboard related utility methods.
 * @class StarboardUtil
 */
class StarboardUtil {
  /**
   * Creates an instance of StarboardUtil.
   */
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  /**
   * Handles a starboard reaction.
   * @param {Client} client The Client.
   * @param {Reaction} reaction The reaction that was added.
   * @param {User} user The user that reacted.
   * @returns {Promise<void>}
   */
  async handle(client, reaction, user) {
    const { emoji, users } = reaction;
    const message = await reaction.message.fetch();

    if (STARBOARD !== emoji.name || user.id === message.author.id) return;

    const guildData = client.database && await client.database.guilds.get(message.guild.id);
    const channelId = guildData && guildData.starboard;
    const channel = channelId && message.channel.guild.channels.cache.get(channelId);

    if (channel) {
      const reactionsSize = users.filter((u) => u.id !== message.author.id).size;

      // Search embed exists
      const messages = await channel.messages.fetch({ limit: 100 });
      const found = messages.find((msg) =>
        msg.author.id === client.user.id &&
        msg.embeds.length &&
        msg.embeds[0].footer &&
        msg.embeds[0].footer.text === message.id,
      );
      // Delete message if users reaction = 0
      if (reactionsSize < 3) {
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
}

module.exports = StarboardUtil;
