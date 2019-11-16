'use strict';

const { Command, SimplicityEmbed } = require('@structures');

class Avatar extends Command {
  constructor(client) {
    super(client, {
      name: 'avatar',
      aliases: ['av'],
      category: 'util',
    }, [
      {
        type: 'user',
        required: false,
        acceptBot: true,
        acceptSelf: true,
        fetchGlobal: true,
      },
      [
        {
          name: 'size',
          type: 'number',
          whitelist: Array.from({ length: 8 }, (e, i) => 2 ** (i + 4)),
          missingError: 'errors:invalidImageSize',
        },
        {
          name: 'format',
          type: 'string',
          whitelist: ['png', 'jpg', 'webp', 'gif'],
          missingError: 'errors:invalidImageFormat',
        },
      ],
    ]);
  }

  run({ author, flags, t, channel }, user = author) {
    const { size = 2048, format } = flags;
    const avatarUrl = user.displayAvatarURL({ size, format });

    const embed = new SimplicityEmbed({ author, t }, { autoAuthor: false })
      .setAuthor(user)
      .setImage(avatarUrl);

    return channel.send(embed);
  }
}

module.exports = Avatar;
