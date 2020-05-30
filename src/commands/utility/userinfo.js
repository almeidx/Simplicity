'use strict';

const { Command, SimplicityEmbed, CommandError } = require('@structures');
const { Constants, PermissionUtil, Util } = require('@util');
const { SPOTIFY_LOGO_PNG_URL, PERMISSIONS, ADMINISTRATOR_PERMISSION, NORMAL_PERMISSIONS } = Constants;
const { dest, isEmpty } = Util;
const moment = require('moment');

class UserInfo extends Command {
  constructor(client) {
    super(client, {
      aliases: ['ui', 'user', 'userinformation', 'infouser', 'informationuser'],
      category: 'util',
      name: 'userInfo',
      requirements: { clientPermissions: ['EMBED_LINKS'] },
    }, [
      {
        acceptBot: true,
        acceptSelf: true,
        fetchGlobal: true,
        missingError: 'errors:invalidUser',
        required: false,
        type: 'user',
      },
      [
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
    ]);
  }

  run({ author, channel, flags, guild, language, t, emoji }, user = author) {
    moment.locale(language);
    if (flags.spotify) {
      if (user.isPartial) {
        throw new CommandError('commands:userinfo.partial');
      } else if (!this.isListeningToSpotify(user.presence)) {
        throw new CommandError('commands:userinfo.notListeningToSpotify');
      }
      return channel.send(this.spotifyEmbed(author, user, t));
    } else if (flags.roles) {
      const member = guild.member(user);
      if (!member) {
        throw new CommandError('commands:userinfo.notInGuild');
      }
      return channel.send(this.rolesEmbed(member.roles.cache.filter((r) => r.id !== guild.id), user, author, t));
    } else {
      const content = user.isPartial ? t('commands:userinfo.cannotPartial') : '';
      return channel.send(content, this.userInfoEmbed(user, author, t, emoji, guild));
    }
  }

  isListeningToSpotify(presence) {
    const activities = dest(presence, 'activites');
    return !isEmpty(activities) && activities.some(
      (a) => a.type === 'LISTENING' && dest(a.party, 'id') && dest(a.party, 'id').includes('spotify:'),
    );
  }

  spotifyEmbed(author, user, t) {
    const presence = user.presence;
    const activities = dest(presence, 'activities');
    const activity = !isEmpty(activities) && activities.filter(
      (a) => a.type === 'LISTENING' && dest(a.party, 'id') && dest(a.party, 'id').includes('spotify:'),
    );
    if (!activity) throw new CommandError('commands:userinfo.notListeningToSpotify');
    const trackName = activity.details;
    const artist = activity.state.split(';').join(',');
    const album = activity.assets && activity.assets.largeText;
    const largeImage = activity.assets && activity.assets.largeImage;
    const image = largeImage && `https://i.scdn.co/image/${largeImage.replace('spotify:', '')}`;

    const embed = new SimplicityEmbed({ author, t })
      .setAuthor('commands:userinfo.spotify', SPOTIFY_LOGO_PNG_URL)
      .addField('» $$commands:userinfo.track', trackName, true)
      .addField('» $$commands:userinfo.artist', artist, true)
      .addField('» $$commands:userinfo.album', album)
      .setColor('GREEN');

    if (image) embed.setThumbnail(image);
    return embed;
  }

  rolesEmbed(roles, user, author, t) {
    const role = roles && roles.find((r) => r.color);
    return new SimplicityEmbed({ author, t })
      .setAuthor(
        '» $$commands:userinfo.authorRoles', user.displayAvatarURL({ dynamic: true }), '', { user: user.username },
      )
      .setDescription(roles.map((r) => r).sort((a, b) => b.position - a.position).join('\n'))
      .setColor(role ? role.hexColor : process.env.COLOR);
  }

  getTitles(user, client, guild) {
    const titles = [user.tag];
    if (PermissionUtil.verifyDev(user.id, client)) titles.push('#developer');
    if (guild && guild.ownerID === user.id) titles.push('#crown');
    if (user.bot) titles.push('#bot');
    return titles;
  }

  getClientStatus(presence) {
    const status = presence.clientStatus && Object.keys(presence.clientStatus);
    if (status && status.length) return status.map((x) => `#${x}`);
    else return [];
  }

  getJoinPosition(id, guild) {
    if (!guild.member(id)) return;

    const array = guild.members.cache.array();
    array.sort((a, b) => a.joinedAt - b.joinedAt);

    const result = array.map((m, i) => ({ id: m.user.id, index: i })).find((m) => m.id === id);
    return (result && result.index) || null;
  }

  // eslint-disable-next-line complexity
  userInfoEmbed(user, author, t, emoji, guild) {
    const { id, tag } = user;
    const member = guild.member(user);
    const presence = !user.isPartial && user.presence;
    const custom = this.getTitles(user, user.client, guild);
    const status = (presence && this.getClientStatus(presence)) || [];
    const titles = [...custom, ...status].join(' ');
    const highestRole = member && member.roles.highest.id !== guild.id && member.roles.highest;
    const activities = dest(presence, 'activities');
    const activity = !isEmpty(activities) && activities.map((a) => a.name);
    const activityType = activity && activity.type && activity.name;
    const joinPosition = this.getJoinPosition(user.id, guild);
    const created = moment(user.createdAt);
    const joined = member && moment(member.joinedAt);

    const rolesClean = member && member.roles.cache
      .filter((r) => r.id !== guild.id)
      .map((r) => r.name || `${r}`);

    const embed = new SimplicityEmbed({ author, emoji, t }, { autoAuthor: false })
      .setAuthor(titles, user.displayAvatarURL({ dynamic: true }))
      .setThumbnail(user)
      .addField('» $$commands:userinfo.username', tag, true);

    if (member && member.nickname) embed.addField('» $$commands:userinfo.nickname', member.nickname, true);

    embed.addField('» $$commands:userinfo.id', id, true);

    if (presence) {
      const userStatus = `#${presence.status} $$common:status.${presence.status}`;
      embed.addField('» $$commands:userinfo.status', userStatus, true);
    }

    if (member && highestRole && member.roles.cache.length > 5) {
      const roleString = highestRole.name || `${highestRole}`;
      embed.addField('» $$commands:userinfo.highestRole', roleString, true);
    }

    if (activityType) embed.addField(`» $$common:activityType.${activity.type}`, activity.name, true);
    if (rolesClean && rolesClean.length && rolesClean.length <= 5) {
      embed.addField('» $$commands:userinfo.roles', rolesClean.join(', '), true);
    }

    if (joinPosition) embed.addField('» $$commands:userinfo.joinPosition', joinPosition, true);
    embed.addField('» $$commands:userinfo.createdAt', `${created.format('LL')} (${created.fromNow()})`);
    if (joined) embed.addField('» $$commands:userinfo.joinedAt', `${joined.format('LL')} (${joined.fromNow()})`);

    const memberPermissions = member && member.permissions &&
      member.permissions.toArray().filter((p) => !NORMAL_PERMISSIONS.includes(p));
    let resultAdministrator, resultAllPermissions, resultPermissions;
    if (memberPermissions) {
      resultAdministrator = memberPermissions.includes(ADMINISTRATOR_PERMISSION) &&
        t(`permissions:${ADMINISTRATOR_PERMISSION}`);
      resultAllPermissions = memberPermissions.sort((a, b) => PERMISSIONS.indexOf(a) - PERMISSIONS.indexOf(b));
      resultPermissions = resultAdministrator || (resultAllPermissions &&
        resultAllPermissions.map((p) => t(`permissions:${p}`)).join(', '));
    }
    if (resultPermissions) embed.addField('» $$commands:userinfo.permissions', resultPermissions);

    return embed;
  }
}

module.exports = UserInfo;
