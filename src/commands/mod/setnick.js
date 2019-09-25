'use strict';

const { Command, CommandError, Parameters, SimplicityEmbed } = require('../../');
const { MemberParameter, StringParameter } = Parameters;

const MemberParameterOptions = {
  checkIncludes: false,
  required: false,
  canBeGuildOwner: false,
  canBeAuthor: true,
  errors: {
    missingError: 'errors:invalidUser',
  },
};
const StringParameterOptions = {
  maxLength: 32,
  default: '',
  errors: {
    maxLength: 'commands:setnick.nameTooBig',
  },
};

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
        argsRequired: true },
    });
  }

  async run({ args, author, guild, member, send, t }) {
    const user = await MemberParameter.parse(args.shift(), MemberParameterOptions, {
      memberAuthor: member,
      commandName: this.name,
      author,
      guild,
    });
    const name = await StringParameter.parse(args.join(' '), StringParameterOptions) || '';

    if (user.displayName === name) throw new CommandError('commands:setnick.alreadySet', { user, name });
    else if (!user.nickname && !name) throw new CommandError('commands:setnick.alreadyReset', { user });

    const renamedTo = (name && t('commands:setnick.success', { user, name })) ||
      t('commands:setnick.removedNickname', { user });
    const reason = t('commands:setnick.reason', { author: author.tag });

    const success = await user.setNickname(name, reason).catch(() => null);
    if (!success) throw new CommandError('commands:setnick.failed');

    const embed = new SimplicityEmbed({ author })
      .setDescription(renamedTo);
    return send(embed);
  }
}

module.exports = SetNick;
