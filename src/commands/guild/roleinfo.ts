import { Role } from 'discord.js';
import { format, formatDistance } from 'date-fns';
import { DateUtil } from '../../util';
import {
  Command, CommandContext, SimplicityClient, Embed,
} from '../../structures';

export default class RoleInfoCommand extends Command {
  constructor(client: SimplicityClient) {
    super(client, 'roleinfo', {
      aliases: ['ri'],
      args: [
        {
          type: 'role',
          optional: false,
          showUsage: true,
          acceptEveryone: true,
          authorNeedsHigherRole: false,
          botNeedsHigherRole: false,
          missingError: 'commands:roleinfo.noArgs',
        },
      ],
      category: 'guild',
      requirements: { guildOnly: true },
    });
  }

  async run(ctx: CommandContext, role: Role): Promise<void> {
    const {
      author, language, guild, send, t,
    } = ctx;
    const totalRoles = guild.roles.cache.filter((r) => r.id !== guild.id).size;
    const checkTick = (condition: boolean): string => (
      condition ? ctx.getEmoji(false, 'TICK_YES') : ctx.getEmoji(false, 'TICK_NO')
    );

    const embed = new Embed(author, { t })
      .setThumbnail(guild)
      .addFields(
        { inline: true, name: '» $$commands:roleinfo.name', value: role.name },
        { inline: true, name: '» $$commands:roleinfo.id', value: role.id },
      );

    if (role.hexColor !== '#000000') {
      embed.addField('» $$commands:roleinfo.color', role.hexColor, true);
    }

    const members = `${role.members.first(15).join(', ')}${role.members.size > 15
      ? ` ${t('commands:roleinfo.moreMembers', { size: role.members.size - 15 })}`
      : ''}`;
    const locale = DateUtil.getLocale(language);
    const date = this.parseDate(role.createdAt, locale);

    embed.addFields(
      { inline: true, name: '» $$commands:roleinfo.position', value: `${role.position}/${totalRoles}` },
      { inline: true, name: '» $$commands:roleinfo.mentionable', value: checkTick(role.mentionable) },
      { inline: true, name: '» $$commands:roleinfo.hoisted', value: checkTick(role.hoist) },
      { name: '» $$commands:roleinfo.createdAt', value: date },
    );

    if (members) embed.addField('» $$commands:roleinfo.members', members, true, { size: role.members.size });
    await send(embed);
  }

  private parseDate(date: Date, locale: Locale): string {
    return `${format(date, 'PPPP', { locale })} (${formatDistance(date, new Date(), { locale })})`;
  }
}
