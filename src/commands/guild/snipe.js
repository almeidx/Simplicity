'use strict';

const { Command, SimplicityEmbed, CommandError } = require('@structures');
const AllowedImageFormats = [
  'webp',
  'png',
  'jpg',
  'gif',
];

class SnipeCommand extends Command {
  constructor(client) {
    super(client, {
      category: 'guild',
      cooldown: 3000,
      name: 'snipe',
      requirements: { guildOnly: true },
    }, [
      {
        acceptText: true,
        canBeHiddenBot: false,
        canBeHiddenUser: false,
        required: false,
        type: 'channel',
      },
    ]);
  }

  async run({ channel: currentChannel, client, t, send }, channel = currentChannel) {
    const msg = client.deletedMessages.get(channel.id);

    if (!msg || (msg && !msg.author && msg.content && !msg.attachments.size && !msg.embeds.length)) {
      throw new CommandError('commands:snipe.notFound');
    }

    const embed = new SimplicityEmbed(msg.author)
      .setDescription(msg.content)
      .setFooter(`#${channel.name}`)
      .setTimestamp(msg.timestamp);

    let attachments = msg.attachments.array();
    if (attachments.length > 0) {
      const image = attachments.find(a => AllowedImageFormats.some(format => a.name.endsWith(format)));
      if (image) {
        embed.setImage(image.proxyURL);
        delete attachments[attachments.indexOf(image)];
      }

      attachments = attachments.filter(a => a);
      if (attachments.length > 0) {
        embed.addField(t('commands:snipe.files'), attachments.map(a => `[${a.name}](${a.url})`));
      }
    }

    await send(embed);
    if (msg.embeds.length > 0) await send(msg.embeds[0]);
  }
}

module.exports = SnipeCommand;
