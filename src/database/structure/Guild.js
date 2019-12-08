'use strict';

const { CommandError } = require('@structures');

// ta entendendo isso aqui?
// tipo quero q tenha funções dentro do guildData
// guildData.setPrefix
class Guild {
  constructor(guild) {
    this._data = guild;
  }

  get prefix() {
    return this._data.prefix;
  }

  get language() {
    return this._data.lang;
  }

  get id() {
    return this._data._id;
  }

  get autoroleId() {
    const autorole = this._data.modules.get('autorole');
    return autorole && autorole.values;
  }

  async setAutoRole(roleId, authorId) {
    const autorole = this._data.modules.get('autorole') || {};
    const autoroleId = autorole.values;

    if (!roleId && !autoroleId) throw new CommandError('commands:autorole.requireRole');
    if (roleId === autoroleId) throw new CommandError('commands.autorole.isCurrentRole');

    this._data.modules.set('autorole', { ...autorole, roleId, authorId });
    await this._data.save();

    return this.autorole;
  }
}

module.exports = Guild;
