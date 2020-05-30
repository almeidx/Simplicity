'use strict';

const { Command, SimplicityEmbed } = require('@structures');

class Avatar extends Command {
  constructor(client) {
    super(client, {
      aliases: ['av'],
      category: 'util',
      name: 'avatar',
    }, [
      {
        acceptBot: true,
        acceptSelf: true,
        fetchGlobal: true,
        required: false,
        type: 'user',
      },
      [
        {
          missingError: 'errors:invalidImageSize',
          name: 'size',
          type: 'number',
          whitelist: Array.from({ length: 8 }, (e, i) => 2 ** (i + 4)),
        },
        {
          missingError: 'errors:invalidImageFormat',
          name: 'format',
          type: 'string',
          whitelist: ['png', 'jpg', 'webp', 'gif'],
        },
      ],
    ]);
  }

  run({ author, flags, send, t }, user = author) {
    const { size = 2048, format } = flags;
    const avatarUrl = user.displayAvatarURL({ dynamic: true, format, size });

    const embed = new SimplicityEmbed({ author, t }, { autoAuthor: false })
      .setAuthor(user)
      .setImage(avatarUrl);
    return send(embed);
  }
}

module.exports = Avatar;
