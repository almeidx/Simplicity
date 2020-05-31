'use strict';

const { SimplicityEmbed, Command, CommandError } = require('@structures');

class AddEmoji extends Command {
  constructor(client) {
    super(client, 'addemoji', {
      aliases: ['createmoji', 'createemoji'],
      args: [
        {
          errorRegex: /[^a-z0-9_]/gi,
          errors: {
            maxLength: 'commands:addemoji.nameTooBig',
            minLength: 'commands:addemoji.nameTooShort',
            regex: 'commands:addemoji.invalidName',
          },
          maxLength: 32,
          minLength: 2,
          missingError: 'commands:addemoji.invalidName',
          required: true,
          type: 'string',
        },
        {
          attachment: true,
          authorAvatar: false,
          lastMessages: { limit: 25 },
          missingError: 'commands:addemoji.invalidURL',
          required: true,
          type: 'image',
          url: true,
        },
      ],
      category: 'guild',
      requirements: {
        clientPermissions: ['EMBED_LINKS', 'MANAGE_EMOJIS'],
        guildOnly: true,
        permissions: ['MANAGE_EMOJIS'],
      },
    });
  }

  async run({ author, send, t, guild }, name, image) {
    let error;
    const emoji = await guild.emojis.create(image, name).catch((err) => { error = err; });
    if (!emoji || error) throw new CommandError('commands:addemoji.error', { msg: error.message });

    const embed = new SimplicityEmbed({ author, t })
      .setDescription('$$commands:addemoji.emojiCreated', { emoji: emoji.toString() })
      .setTitle('$$commands:addemoji.success');
    return send(embed);
  }
}

module.exports = AddEmoji;
