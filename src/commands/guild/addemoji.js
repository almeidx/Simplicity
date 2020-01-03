'use strict';

const { SimplicityEmbed, Command, CommandError } = require('@structures');

class AddEmoji extends Command {
  constructor(client) {
    super(client, {
      name: 'addemoji',
      aliases: ['createmoji', 'createemoji'],
      category: 'guild',
      requirements: {
        argsRequired: true,
        guildOnly: true,
        permissions: ['MANAGE_EMOJIS'],
        clientPermissions: ['EMBED_LINKS', 'MANAGE_EMOJIS'],
      },
    }, [
      {
        type: 'string',
        maxLength: 32,
        minLength: 2,
        errorRegex: /[^a-z0-9_]/gi,
        required: true,
        missingError: 'errors:addemoji.missingName',
        errors: {
          maxLength: 'commands:addemoji:nameTooBig',
          minLength: 'commands:addemoji:nameTooShort',
          regex: 'commands:addemoji:invalidName',
        },
      },
      {
        type: 'image',
        url: true,
        required: true,
        authorAvatar: false,
        attachment: true,
        lastMessages: { limit: 25 },
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
