'use strict';

const { Command, CommandError, SimplicityEmbed } = require('@structures');

class SetNick extends Command {
  constructor(client) {
    super(client, {
      name: 'setnick',
      category: 'mod',
      aliases: ['nick', 'nickname', 'setnickname'],
      requirements: {
        permissions: ['MANAGE_NICKNAMES'],
        clientPermissions: ['MANAGE_NICKNAMES'],
        guildOnly: true,
        argsRequired: true,
      },
    }, [
      {
        type: 'member',
        acceptSelf: true,
        acceptBot: true,
        required: true,
        missingError: 'errors:invalidUser',
        authorHasHigh: true,
        clientHasHigh: true,
      },
      {
        type: 'string',
        required: false,
        clean: true,
        maxLength: 32,
      },
    ]);
  }

  async run({ t, author, client, channel }, member, nickname = '') {
    if (member.displayName === nickname) {
      throw new CommandError('commands:setnick.alreadySet', { member, nickname });
    } else if (!member.nickname && !nickname) {
      throw new CommandError('commands:setnick.alreadyReset', { member });
    }

    try {
      const reason = t('commands:setnick.reason', { author: author.tag });
      await member.setNickname(nickname, reason);
    } catch (error) {
      client.logger.error(error);
      throw new CommandError('commands:setnick.failed');
    }

    const text = nickname ? 'commands:setnick.success' : 'commands:setnick.removedNickname';

    const embed = new SimplicityEmbed({ author })
      .setDescription(t(text, { member, nickname }));
    return channel.send(embed);
  }
}

module.exports = SetNick;
