import { Guild } from 'discord.js';
import { SimplicityEmbed, SimplicityListener, SimplicityClient } from '../../structures';
import { JoinLeaveGuild, JoinLeaveGuildTypes } from '../../database';

export default class GuildCreateListener extends SimplicityListener {
  constructor(client: SimplicityClient) {
    super('guildCreate', client);
  }

  async exec(guild: Guild): Promise<void> {
    this.sendPrivateMessage('GUILD_JOIN',
      new SimplicityEmbed(guild.owner?.user)
        .setThumbnail(guild)
        .addFields(
          { inline: true, name: 'Guild Name', value: guild.name },
          { inline: true, name: 'Guild ID', value: guild.id },
          { inline: true, name: 'Guild Count', value: guild.memberCount },
        ));

    if (this.client.database) {
      await this.client.database.guilds.get(guild.id);
      const data: JoinLeaveGuild = {
        eventAt: new Date(),
        guildId: guild.id,
        type: JoinLeaveGuildTypes.JOIN,
      };
      await this.client.database.joinLeaveGuild.create(data);
    }
  }
}
