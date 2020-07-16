import { version } from 'discord.js';
import { formatDistance } from 'date-fns';
import { BOT_DEFAULT_PERMISSIONS, DateUtil } from '../../util';
import Config from '../../config';
import {
  Command, Embed, SimplicityClient, CommandContext,
} from '../../structures';

export default class BotInfo extends Command {
  constructor(client: SimplicityClient) {
    super(client, 'botinfo', {
      aliases: ['bi', 'stats'],
      category: 'bot',
      cooldown: 10000,
      requirements: { clientPermissions: ['EMBED_LINKS'] },
    });
  }

  async run({
    author, client, guild, prefix, send, t, language,
  }: CommandContext): Promise<void> {
    const uptime = formatDistance(
      0, client.uptime as number,
      { includeSeconds: true, locale: DateUtil.getLocale(language) },
    );
    const ram = (process.memoryUsage().heapUsed / 1048576).toFixed(2);
    const inviteLink = await client.generateInvite(BOT_DEFAULT_PERMISSIONS);
    const ping = Math.ceil(guild ? guild.shard.ping : client.ws.ping);
    const devs = Config.DEVELOPER_IDS.filter((id) => client.users.cache.has(id))
      .map((id) => client.users.resolve(id)?.tag)
      .filter((u) => u)
      .sort()
      .join(', ');

    const embed = new Embed(author, { t })
      .addFields(
        { inline: true, name: '» $$commands:botinfo.ping', value: `${ping}ms` },
        { inline: true, name: '» $$commands:botinfo.users', value: client.users.cache.size },
        { inline: true, name: '» $$commands:botinfo.guilds', value: client.guilds.cache.size },
        { inline: true, name: '» $$commands:botinfo.prefix', value: prefix },
        { inline: true, name: '» $$commands:botinfo.memoryUsage', value: `${ram}mb` },
        { inline: true, name: '» $$commands:botinfo.discordjs', value: version },
        { inline: true, name: '» $$commands:botinfo.node', value: process.versions.node },
        { inline: true, name: '» $$commands:botinfo.commands', value: client.commands.size },
        { inline: true, name: '» $$commands:botinfo.links', value: `[$$commands:botinfo.inviteBot](${inviteLink})` },
      );

    if (devs) embed.addField('» $$commands:botinfo.developers', devs);

    embed.addField('» $$commands:botinfo.uptime', uptime);
    await send(embed);
  }
}
