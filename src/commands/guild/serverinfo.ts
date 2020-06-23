import {
  Collection, Role, User, Guild,
} from 'discord.js';
import { TFunction } from 'i18next';
import {
  Command, CommandContext, SimplicityClient, Embed,
} from '../../structures';
import { DateUtil } from '../../util';

export default class ServerInfoCommand extends Command {
  constructor(client: SimplicityClient) {
    super(client, 'serverinfo', {
      aliases: ['si', 'server', 'sv', 'guild'],
      category: 'guild',
      flags: [
        {
          aliases: ['r'],
          type: 'booleanFlag',
          name: 'roles',
        },
      ],
    });
  }

  async run({
    author, emoji, flags, guild, send, t, language, channel,
  }: CommandContext): Promise<void> {
    const roles = guild.roles.cache.filter((r) => r.id !== guild.id)
      .sort((a, b) => b.position - a.position);

    if (flags.roles) {
      await send(this.createEmbedRoles(roles, guild, author, t));
      return;
    }

    if (guild.memberCount !== guild.members.cache.size) await guild.members.fetch();

    const locale = DateUtil.getLocale(language);
    const totalMembers = guild.memberCount;
    const members = guild.members.cache;
    const onlineMembers = members.filter((m) => m.presence.status !== 'offline').size;
    const offlineMembers = members.filter((m) => m.presence.status === 'offline').size;

    const channels = guild.channels.cache;
    const textChannels = channels.filter((ch) => ['text', 'news'].includes(ch.type)).size;
    const totalChannels = channels.filter((ch) => ch.type !== 'category').size;
    const voiceChannels = channels.filter((ch) => ch.type === 'voice').size;

    const rolesClean = roles
      .map((r) => r)
      .slice(0, -1)
      .map((r) => r.name || `${r}`);

    const emojis = guild.emojis.cache.size;
    const owner: string = guild.owner?.user.tag ?? t('commands:serverinfo.unknown');
    const date = DateUtil.formatDiff(guild.createdAt, locale);

    const boostTier = guild.premiumTier;
    const boosters = guild.premiumSubscriptionCount;

    const embed = new Embed(author, { t })
      .setThumbnail(guild)
      .addFields(
        { inline: true, name: '» $$commands:serverinfo.name', value: guild.name },
        { inline: true, name: '» $$commands:serverinfo.id', value: guild.id },
        { inline: true, name: '» $$commands:serverinfo.owner', value: owner },
        { inline: true, name: '» $$commands:serverinfo.emotes', value: emojis },
      );

    const guildIcon = embed.resolveImage(guild);
    embed.setThumbnail(guildIcon);

    if (roles.size <= 5) {
      embed.addField('» $$commands:serverinfo.roles', rolesClean.join(', '), true, { totalRoles: roles.size });
    } else {
      embed.addField('» $$commands:serverinfo.totalRoles', roles.size, true);
    }

    if (boostTier && boosters) {
      embed.addField('» $$commands:serverinfo.boostTier', '$$commands:serverinfo.tier', true, {}, { boostTier });
    }

    embed
      .addFields(
        {
          inline: true,
          name: '» $$commands:serverinfo.members',
          options: { totalMembers },
          value: '$$commands:serverinfo.onlineOffline',
          valueOptions: { offlineMembers, onlineMembers },
        },
        {
          inline: true,
          name: '» $$commands:serverinfo.channels',
          options: { totalChannels },
          value: '$$commands:serverinfo.textVoice',
          valueOptions: { textChannels, voiceChannels },
        },
        {
          name: '» $$commands:serverinfo.created',
          value: date,
        },
        {
          inline: true,
          name: '» $$commands:serverinfo.verificationLevel',
          options: { level: guild.verificationLevel },
          value: `$$commands:serverinfo.verificationDetails.${guild.verificationLevel}`,
        },
      );

    const message = await send(embed);

    const permissions = channel.permissionsFor(String(guild.me?.id));
    const roleRestriction = roles.size > 5;

    if (permissions?.has('ADD_REACTIONS') && roleRestriction) {
      const role = {
        embed: this.createEmbedRoles(roles, guildIcon, author, t),
        emoji: emoji(true, 'ROLES'),
      };

      await message.react(role.emoji);

      const serverinfoEmoji = emoji(true, 'BACK');
      await message.react(serverinfoEmoji);

      const collector = await message.createReactionCollector((r, u) => r.me && author.id === u.id, { time: 30000 });

      collector.on('collect', async ({ emoji: emote, users, message: collectorMessage }) => {
        const name = emote.id || emote.name;
        const checkEmbed = (e: Embed) => e.author?.name === collectorMessage.embeds[0].author?.name;

        if (permissions.has('MANAGE_MESSAGES')) await users.remove(author.id);
        if (name === serverinfoEmoji && !checkEmbed(embed)) await collectorMessage.edit(embed);
        if (role && name === role.emoji && !checkEmbed(role.embed)) await collectorMessage.edit(role.embed);
      });

      collector.on('end', async () => {
        if (message && permissions.has('MANAGE_MESSAGES')) await message.reactions.removeAll().catch(() => null);
      });
    }
  }

  private createEmbedRoles(
    roles: Collection<string, Role>, guildIcon: string | Guild, author: User, t: TFunction,
  ): Embed {
    const rolesClean = roles.first(25).join('\n')
    + (roles.size > 25 ? `\n${t('commands:serverinfo.moreRoles', { count: roles.size - 25 })}` : '');
    return new Embed(author, { t })
      .setThumbnail(guildIcon)
      .setAuthor('$$commands:serverinfo.roles', undefined, undefined, { totalRoles: roles.size })
      .setDescription(rolesClean);
  }
}

