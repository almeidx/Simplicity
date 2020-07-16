import {
  Command, CommandContext, CommandError, Embed, SimplicityClient,
} from '../../structures';

export default class ConfigCommand extends Command {
  constructor(client: SimplicityClient) {
    super(client, 'config', {
      aliases: ['cfg'],
      category: 'module',
      requirements: {
        guildOnly: true,
        userPermissions: ['MANAGE_GUILD'],
        requireDatabase: true,
      },
    });
  }

  async run({
    author, guild, guildData, language, prefix, send, t,
  }: CommandContext): Promise<void> {
    if (!guildData) throw new CommandError('No guild data');
    const channel = guild.channels.cache.find((c) => c.id === guildData.starboard?.channelId);
    const disabledChannels = guildData.disabledChannels
      .map((id) => guild.channels.resolve(id))
      .filter((c) => c)
      .map((c) => `${c}`);

    const channels = disabledChannels.join(', ') || '$$commands:config.noDisableChannel';
    const starboard = channel ? `${channel}` : '$$commands:config.moduleOff';

    const embed = new Embed(author, { t })
      .addFields(
        { inline: true, name: '» $$commands:config.prefix', value: prefix },
        { inline: true, name: '» $$commands:config.language', value: language },
        { inline: true, name: '» $$commands:config.starboard', value: starboard },
        { inline: true, name: '» $$commands:config.disabledChannels', value: channels },
      );

    await send(embed);
  }
}
