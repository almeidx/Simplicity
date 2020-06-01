'use strict';

const { Collection } = require('discord.js');

class CommandCollection extends Collection {
  constructor() {
    super();
    this.aliases = new Collection();
  }

  find(str) {
    return this.get(this.aliases.get(str.toLowerCase()));
  }

  set(command) {
    super.set(command.name, command);
    this.aliases.set(command.name, command.name);
    for (let alias of command.aliases) {
      const conflict = this.aliases.get(alias.toLowerCase());
      if (conflict) throw new Error(`Alias '${alias}' of '${command.name}' already exists on '${conflict}'`);

      alias = alias.toLowerCase();
      this.aliases.set(alias, command.name);
    }
  }
}

module.exports = CommandCollection;
