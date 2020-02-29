'use strict';

const { SimplicityEmbed, Command, CommandError } = require('@structures');

class AddEmoji extends Command {
  constructor(client) {
    super(client, {
      aliases: ['createmoji', 'createemoji'],
      category: 'guild',
      name: 'addemoji',
      requirements: {
        clientPermissions: ['EMBED_LINKS', 'MANAGE_EMOJIS'],
        guildOnly: true,
        permissions: ['MANAGE_EMOJIS'],
      },
    }, [
      {
        errorRegex: /[^a-z0-9_]/gi,
        errors: {
          maxLength: 'commands:addemoji:nameTooBig',
          minLength: 'commands:addemoji:nameTooShort',
          regex: 'commands:addemoji:invalidName',
        },
        maxLength: 32,
        minLength: 2,
        missingError: '',
        required: true,
        type: 'string',
      },
      {
        attachment: true,
        authorAvatar: false,
        lastMessages: { limit: 25 },
        required: true,
        type: 'image',
        url: true,
      },
    ]);
  }

  async run({ author, send, t, guild }, name, image) {
    const emoji = await guild.emojis.create(image, name);
    if (!emoji) throw new CommandError('commands:addemoji.error');

    const embed = new SimplicityEmbed({ author, t })
      .setDescription('commands:addemoji.emojiCreated', { emoji: emoji.toString() })
      .setTitle('commands:addemoji.success');
    return send(embed);
  }
}

module.exports = AddEmoji;
