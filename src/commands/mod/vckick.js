'use strict';

const { Command, CommandError, Parameters: { MemberParameter }, SimplicityEmbed } = require('../../');
const MemberParameterOptions = {
  required: true,
  canBeAuthor: false,
  canBeGuildOwner: false,
  errors: {
    missingError: 'errors:invalidUser',
  },
};

class VoiceKick extends Command {
  constructor(client) {
    super(client, {
      aliases: ['voicekick', 'vkick', 'kickvoice', 'kickvc'],
      category: 'mod',
      requirements: {
        argsRequired: true,
        permissions: ['KICK_MEMBERS'],
        clientPermissions: ['MOVE_MEMBERS'],
      },
    });
  }

  async run({ author, guild, member: memberAuthor, query, send, t }) {
    const member = await MemberParameter.parse(query, MemberParameterOptions, {
      memberAuthor,
      commandName: this.name,
      author,
      guild,
    });
    await MemberParameter.verifyExceptions(member, MemberParameterOptions, {
      guild,
      memberAuthor,
      commandName: this.name,
    });

    if (!member.voice || !member.voice.channel) throw new CommandError('errors:noVoiceChannel');

    const oldChannelName = member.voice.channel.name;
    const reason = t('commands:vckick.reason', { author: author.tag, user: member.user.tag });

    await member.voice.setChannel(null, reason);

    const embed = new SimplicityEmbed({ author, t })
      .setDescription(t('commands:vckick.success', { author, user: member, oldChannelName }));
    return send(embed);
  }
}

module.exports = VoiceKick;
