'use strict';

const { Command, SimplicityEmbed, Constants, Parameters, PermissionsUtils, Utils } = require('../../');
const { SPOTIFY_LOGO_PNG_URL, PERMISSIONS, ADMINISTRATOR_PERMISSION, NORMAL_PERMISSIONS } = Constants;
const { getJoinPosition } = Utils;
const { UserParameter } = Parameters;
const moment = require('moment');

class UserInfo extends Command {
  constructor(client) {
    super(client, {
      name: 'userInfo',
      aliases: ['ui', 'user', 'userinformation', 'infouser', 'informationuser'],
      category: 'util',
      requirements: {
        clientPermissions: ['EMBED_LINKS']
      }
  });
  }

  // eslint-disable-next-line complexity
  async run({ author, client, channel, emoji, guild, query, send, t }) {
    const canShowMemberInfo = (query && client.users.has(query)) || true;
    const user = !query ?
      author :
      await UserParameter.parse(query, {
        errors: { missingError: 'errors:invalidUser' },
        required: true,
      }, { client, guild });
    const member = canShowMemberInfo && guild && guild.member(user);

    const presence = canShowMemberInfo && user.presence;
    const clientStatus = presence && presence.clientStatus;
    const status = clientStatus && Object.keys(clientStatus);

    const titles = [user.tag];
    if (PermissionsUtils.verifyDev(user.id, client)) titles.push('#developer');
    if (guild && guild.ownerID === user.id) titles.push('#crown');
    if (user.bot) titles.push('#bot');
    if (Array.isArray(status)) status.forEach((s) => titles.push(`#${s}`));
    else titles.push(`#${status}`);

    const joinPosition = getJoinPosition(user.id, guild);
    const nickname = member && member.nickname;
    const created = moment(user.createdAt);
    const joined = member && moment(member.joinedAt);

    const highestRole = member && member.roles.highest.id !== guild.id && member.roles.highest;
    const roles = member && member.roles.sort((a, b) => b.position - a.position).map((r) => r).slice(0, -1);
    const rolesClean = roles && roles.map((r) => r.name || r.toString());
    const activity = presence && presence.activity;
    const activityType = activity && activity.type && activity.name;

    const embed = new SimplicityEmbed({ author, emoji, t }, { autoAuthor: false })
      .setAuthor(titles.join(' '), user.displayAvatarURL())
      .setThumbnail(user)
      .addField('» $$commands:userinfo.username', user.tag, true);

    if (nickname) embed.addField('» $$commands:userinfo.nickname', nickname, true);

    embed.addField('» $$commands:userinfo.id', user.id, true);

    if (presence) embed.addField(
      '» $$commands:userinfo.status', `#${presence.status} $$common:status.${presence.status}`, true
    );
    if (highestRole && roles.length > 5) embed.addField(
      '» $$commands:userinfo.highestRole', highestRole.name || highestRole.toString(), true
    );
    if (activityType) embed.addField(`» $$common:activityType.${activity.type}`, activity.name, true);
    if (rolesClean && rolesClean.length && rolesClean.length <= 5) embed.addField(
      '» $$commands:userinfo.roles', rolesClean.join(', '), true
    );
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

    const message = await send(embed);
    const checkPermissions = (p) => channel.permissionsFor(guild.me).has(p);

    if (checkPermissions('ADD_REACTIONS') && checkPermissions('READ_MESSAGE_HISTORY')) {
      const spotifyRestriction = activity && activity.party && activity.party.id &&
        activity.party.id.includes('spotify:');
      let spotify, role;

      if (spotifyRestriction && !user.bot) {
        spotify = {
          emoji: emoji('SPOTIFY', { id: true, other: 'MUSIC' }),
          embed: createEmbedSpotify(activity, { author, t }),
        };
        await message.react(spotify.emoji);
      }

      if (rolesClean && rolesClean.length > 5) {
        role = {
          emoji: emoji('ROLES', { id: true }),
          embed: createEmbedRoles(roles, user, { author, t }),
        };
        await message.react(role.emoji);
      }

      if (spotify || role) {
        const userinfoEmoji = emoji('BACK', { id: true });
        await message.react(userinfoEmoji);

        const filter = (r, u) => r.me && author.id === u.id;
        const collector = await message.createReactionCollector(filter, { errors: ['time'], time: 30000 });

        collector.on('collect', async ({ emoji: collectorEmoji, users, message: collectorMessage }) => {
          const name = collectorEmoji.id || collectorEmoji.name;
          const checkEmbed = (e) => e.author.name === collectorMessage.embeds[0].author.name;

          if (checkPermissions('MANAGE_MESSAGES')) await users.remove(user);
          if (spotify && spotify.emoji === name &&
            !checkEmbed(spotify.embed)) await collectorMessage.edit(spotify.embed);
          if (name === userinfoEmoji && !checkEmbed(embed)) await message.edit(embed);
          if (role && role.emoji === name && !checkEmbed(role.embed)) await collectorMessage.edit(role.embed);
        });

        collector.on('end', async () => {
          if (message && checkPermissions('MANAGE_MESSAGES')) await message.reactions.removeAll().catch(() => null);
        });
      }
    }
  }
}

function createEmbedSpotify(activity, embedOptions) {
  const trackName = activity.details;
  const artist = activity.state.split(';').join(',');
  const album = activity.assets && activity.assets.largeText;
  const largeImage = activity.assets && activity.assets.largeImage;
  const image = largeImage && `https://i.scdn.co/image/${largeImage.replace('spotify:', '')}`;

  const embed = new SimplicityEmbed(embedOptions)
    .setAuthor('commands:userinfo.spotify', SPOTIFY_LOGO_PNG_URL)
    .addField('» $$commands:userinfo.track', trackName, true)
    .addField('» $$commands:userinfo.artist', artist, true)
    .addField('» $$commands:userinfo.album', album)
    .setColor('GREEN');

  if (image) embed.setThumbnail(image);
  return embed;
}

function createEmbedRoles(roles, user, embedOptions) {
  const role = roles && roles.find((r) => r.color);
  return new SimplicityEmbed(embedOptions)
    .setAuthor('» $$commands:userinfo.authorRoles', user.displayAvatarURL(), '', { user: user.username })
    .setDescription(roles.join('\n'))
    .setColor(role ? role.color : process.env.COLOR);
}

module.exports = UserInfo;
