import { Guild } from 'discord.js';
import { SimplicityEmbed, SimplicityListener, SimplicityClient } from '../../structures';
import { JoinLeaveGuild, JoinLeaveGuildTypes } from '../../database';

export default class GuildDeleteListener extends SimplicityListener {
  constructor(client: SimplicityClient) {
    super('guildDelete', client);
  }

  async exec(guild: Guild): Promise<void> {
    this.sendPrivateMessage('GUILD_LEAVE',
      new SimplicityEmbed(guild.owner?.user)
        .setThumbnail(guild)
        .addFields(
          { inline: true, name: 'Guild Name', value: guild.name },
          { inline: true, name: 'Guild ID', value: guild.id },
          { inline: true, name: 'Guild Count', value: guild.memberCount },
        ));

    if (this.client.database) {
      await this.client.database.guilds.deleteOne({ id: guild.id });
      const data: JoinLeaveGuild = {
        eventAt: new Date(),
        guildId: guild.id,
        type: JoinLeaveGuildTypes.LEAVE,
      };
      await this.client.database.joinLeaveGuild.create(data);
    }
  }
}
