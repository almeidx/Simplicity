import {
  Collection, Guild, GuildMember, Presence, Message, Role, User,
} from 'discord.js';
import { TFunction } from 'i18next';
import { Locale, format, formatDistance } from 'date-fns';
import {
  Command, CommandContext, CommandError, SimplicityClient, Embed,
} from '../../structures';
import {
  Constants, DateUtil, PermissionUtil, Util,
} from '../../util';
import Config from '../../config';
import { Emojis } from '../../util/EmojiUtil';

const {
  SPOTIFY_LOGO_PNG_URL, PERMISSIONS, ADMINISTRATOR_PERMISSION: ADMINISTRATOR, NORMAL_PERMISSIONS,
} = Constants;
const { isEmpty } = Util;

export default class UserInfo extends Command {
  /**
   * @param client The client for this command
   */
  constructor(client: SimplicityClient) {
    super(client, 'userinfo', {
      aliases: ['ui', 'user', 'whois'],
      args: [
        {
          acceptBot: true,
          acceptSelf: true,
          fetchGlobal: true,
          missingError: 'errors:invalidUser',
          type: 'user',
        },
      ],
      category: 'utility',
      flags: [
        {
          aliases: ['music', 'song', 's', 'm'],
          name: 'spotify',
          type: 'booleanFlag',
        },
        {
          aliases: ['r', 'role'],
          name: 'roles',
          type: 'booleanFlag',
        },
      ],
      requirements: { clientPermissions: ['EMBED_LINKS'] },
    });
  }

  run(ctx: CommandContext, user = ctx.author): Promise<Message> {
    const {
      author, channel, flags, guild, language, t,
    } = ctx;

    const locale = DateUtil.getLocale(language);
    if (flags.spotify) {
      if (user.isPartial) {
        throw new CommandError('commands:userinfo.partial');
      } else if (!this.isListeningToSpotify(user.presence)) {
        throw new CommandError('commands:userinfo.notListeningToSpotify');
      }
      return channel.send(this.spotifyEmbed(author, user, t));
    } if (flags.roles) {
      const member = guild.member(user);
      if (!member) {
        throw new CommandError('commands:userinfo.notInGuild');
      }
      return channel.send(this.rolesEmbed(member.roles.cache.filter((r) => r.id !== guild.id), user, author, t));
    }

    const member = guild?.member(user);

    const embed = new Embed()
      .setAuthor(user, null)
      .setThumbnail(user)
      .addField('» User Information', this.getUserInformation(user, locale, t).join('\n'));

    if (member) embed.addField('» Member Information', this.getMemberInformation(member, locale, t).join('\n'));
    const content = user.isPartial ? t('commands:userinfo.cannotPartial') : '';
    return channel.send(content, { embed });
  }

  private isListeningToSpotify(presence: Presence): boolean {
    const activities = presence?.activities;
    return !isEmpty(activities) && activities.some((a) => a.type === 'LISTENING' && a.party?.id?.includes('spotify:'));
  }

  private spotifyEmbed(author: User, user: User, t: TFunction): Embed {
    const { presence } = user;
    const activity = presence?.activities?.find(
      (a) => a.type === 'LISTENING' && a.party?.id?.includes('spotify:')
    );
    if (!activity) throw new CommandError('commands:userinfo.notListeningToSpotify');

    const trackName = activity.details;
    const artist = activity.state?.split(';').join(',');
    const album = activity.assets?.largeText;
    const largeImage = activity.assets?.largeImage;
    const image = largeImage && `https://i.scdn.co/image/${largeImage.replace('spotify:', '')}`;

    const embed = new Embed(author, { t })
      .setAuthor('$$commands:userinfo.spotify', SPOTIFY_LOGO_PNG_URL)
      .setColor('GREEN');

    if (trackName) embed.addField('» $$commands:userinfo.track', trackName, true);
    if (artist) embed.addField('» $$commands:userinfo.artist', artist, true);
    if (album) embed.addField('» $$commands:userinfo.album', album);
    if (image) embed.setThumbnail(image);

    return embed;
  }

  private rolesEmbed(roles: Collection<string, Role>, user: User, author: User, t: TFunction): Embed {
    const role = roles && roles.find((r) => !!r.color);
    const opts = { dynamic: true, format: 'png', size: 4096 } as const;
    return new Embed(author, { t })
      .setAuthor(
        '» $$commands:userinfo.authorRoles', user.displayAvatarURL(opts), '', { user: user.username },
      )
      .setDescription(roles.sort((a, b) => b.position - a.position).map((r) => r.toString()).join('\n'))
      .setColor(role ? role.hexColor : Config.COLOR);
  }

  private getTitles(user: User, { client, guild, emoji }: CommandContext): string[] {
    const titles = [user.tag];
    if (PermissionUtil.verifyDev(user.id, client)) titles.push(emoji(false, 'DEVELOPER'));
    if (guild && guild.ownerID === user.id) titles.push(emoji(false, 'CROWN'));
    if (user.bot) titles.push(emoji(false, 'BOT'));
    return titles;
  }

  private getClientStatus({ emoji }: CommandContext, presence: Presence): string[] {
    const status = presence.clientStatus && Object.keys(presence.clientStatus);
    if (status && status.length) return status.map((x) => emoji(false, x.toUpperCase() as Emojis));
    return [];
  }

  private parseDate(date: Date, locale: Locale): string {
    return `${format(date, 'PPPP', { locale })} (${formatDistance(date, new Date(), { locale })})`;
  }

  private getActivities(presence: Presence, t: TFunction): string {
    const activities = presence.activities?.map((a) => `**${t(`common:activityType.${a.type}`)} ${a.name}**`);
    return !Util.isEmpty(activities) ? activities.join(', ') : `**${t('commands:userinfo.noActivities')}**`;
  }

  private getUserInformation(user: User, locale: Locale, t: TFunction): string[] {
    const {
      tag, id, presence, createdAt,
    } = user;
    return [
      `» ${t('commands:userinfo.username')}: **${tag}**`,
      `» ${t('commands:userinfo.id')}: **${id}**`,
      `» ${t('commands:userinfo.createdAt')}: **${this.parseDate(createdAt, locale)}**`,
      `» ${t('commands:userinfo.activities')}: ${this.getActivities(presence, t)}`,
    ];
  }

  private getMemberInformation(member: GuildMember, locale: Locale, t: TFunction): string[] {
    // if (member && highestRole && member.roles.cache.size > 5) {
    //   const roleString = highestRole.name || `${highestRole}`;
    //   embed.addField('» $$commands:userinfo.highestRole', roleString, true);
    // }

    // if (rolesClean && rolesClean.length && rolesClean.length <= 5) {
    //   embed.addField('» $$commands:userinfo.roles', rolesClean.join(', '), true);
    // }
    // const highestRole = member && member.roles.highest.id !== guild.id && member.roles.highest;
    // const rolesClean = member && member.roles.cache
    //   .filter((r) => r.id !== guild.id)
    //   .map((r) => r.name || `${r}`);

    return [
      `${t('commands:userinfo.joinedAt')}: **${this.parseDate(member.joinedAt as Date, locale)}**`,
      `${t('commands:userinfo.joinPosition')}: **${this.getJoinPosition(member, member.guild)}**`,
      `${t('commands:userinfo.permissions')}: **${this.getMemberPermissions(member, t)}**`,
    ];
  }

  private getJoinPosition(member: GuildMember, guild: Guild): number {
    return (guild.members.cache
      .array()
      .sort((a, b) => (a.joinedTimestamp as number) - (b.joinedTimestamp as number))
      .map((m, i) => ({ id: m.user.id, index: i }))
      .find((m) => m.id === member.user.id)?.index ?? 0) + 1;
  }

  private getMemberPermissions(member: GuildMember, t: TFunction): string {
    const memberPermissions = member.permissions.toArray().filter((p) => !NORMAL_PERMISSIONS.includes(p));
    if (Util.isEmpty(memberPermissions)) {
      return t('commands:userinfo.noPermissions');
    }
    if (memberPermissions.includes(ADMINISTRATOR)) {
      return t(`permissions:${ADMINISTRATOR}`);
    }
    return memberPermissions
      .sort((a, b) => PERMISSIONS.indexOf(a) - PERMISSIONS.indexOf(b))
      .map((p) => t(`permissions:${p}`))
      .join(', ');
  }
}