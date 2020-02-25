'use strict';

const { SPOTIFY_LOGO_PNG_URL, PERMISSIONS, ADMINISTRATOR_PERMISSION, NORMAL_PERMISSIONS } = require('@util/Constants');
const { Command, SimplicityEmbed, CommandError } = require('@structures');
const { PermissionUtil } = require('@util');
const moment = require('moment');

class UserInfo extends Command {
  constructor(client) {
    super(client, {
      name: 'userInfo',
      aliases: ['ui', 'user', 'userinformation', 'infouser', 'informationuser'],
      category: 'util',
      requirements: {
        clientPermissions: ['EMBED_LINKS'],
      },
    }, [
      {
        type: 'user',
        fetchGlobal: true,
        acceptSelf: true,
        acceptBot: true,
        missingError: 'errors:invalidUser',
        required: false,
      },
      [
        {
          name: 'spotify',
          aliases: ['music', 'song', 's', 'm'],
          type: 'booleanFlag',
        },
        {
          name: 'roles',
          aliases: ['r', 'role'],
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
      return channel.send(this.rolesEmbed(member.roles.filter((r) => r.id !== guild.id), user, author, t));
    } else {
      const content = user.isPartial ? t('commands:userinfo.cannotPartial') : '';
      return channel.send(content, this.userInfoEmbed(user, author, t, emoji, guild));
    }
  }

  isListeningToSpotify(presence) {
    return presence && presence.activity && presence.activity.type === 'LISTENING' &&
      presence.activity.party && presence.activity.party.id && presence.activity.party.id.includes('spotify:');
  }

  spotifyEmbed(author, user, t) {
    const presence = user.presence;
    const activity = presence && presence.activity;
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
      .setAuthor('» $$commands:userinfo.authorRoles', user.displayAvatarURL(), '', { user: user.username })
      .setDescription(roles.map((r) => r).sort((a, b) => b.position - a.position).join('\n'))
      .setColor(role ? role.color : process.env.COLOR);
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

    const array = guild.members.array();
    array.sort((a, b) => a.joinedAt - b.joinedAt);

    const result = array.map((m, i) => ({ index: i, id: m.user.id })).find((m) => m.id === id);
    return (result && result.index) || null;
  }

  // eslint-disable-next-line complexity
  userInfoEmbed(user, author, t, emoji, guild) {
    const { tag, id } = user;
    const member = guild.member(user);
    const presence = !user.isPartial && user.presence;
    const custom = this.getTitles(user, user.client, guild);
    const status = presence && this.getClientStatus(presence);
    const titles = [...custom, ...status].join(' ');
    const highestRole = member && member.roles.highest.id !== guild.id && member.roles.highest;
    const activity = presence && presence.activity;
    const activityType = activity && activity.type && activity.name;
    const joinPosition = this.getJoinPosition(user.id, guild);
    const created = moment(user.createdAt);
    const joined = member && moment(member.joinedAt);

    const rolesClean = member && member.roles && member.roles
      .filter((r) => r.id !== guild.id)
      .map((r) => r.name || r.toString());

    const embed = new SimplicityEmbed({ author, emoji, t }, { autoAuthor: false })
      .setAuthor(titles, user.displayAvatarURL())
      .setThumbnail(user)
      .addField('» $$commands:userinfo.username', tag, true);

    if (member && member.nickname) embed.addField('» $$commands:userinfo.nickname', member.nickname, true);

    embed.addField('» $$commands:userinfo.id', id, true);

    if (presence) {
      const userStatus = `#${presence.status} $$common:status.${presence.status}`;
      embed.addField('» $$commands:userinfo.status', userStatus, true);
    }

    if (member && highestRole && member.roles.length > 5) {
      const roleString = highestRole.name || highestRole.toString();
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
    let resultAdministrator; let resultAllPermissions; let resultPermissions;
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
