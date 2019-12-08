'use strict';

const Guild = require('../models/Guild');
const GuildStructure = require('../structure/Guild');

class GuildController {
  constructor() {
    this._guilds = new Map();
  }

  async get(guildId) {
    const cacheGuild = this._guilds.get(guildId);
    if (cacheGuild) return cacheGuild;

    let guild = await Guild.findOne({ id: guildId });
    if (!guild) guild = await Guild.create({ id: guildId });

    this._guilds.set(guildId, new GuildStructure(guild));

    return guild;
  }

  async delete(guildId) {
    this._guilds.delete(guildId);
    await Guild.deleteOne({ id: guildId });
  }
}

module.exports = GuildController;
