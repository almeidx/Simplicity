'use strict';

const { Loader } = require('@structures');
const { requireDirectory } = require('@util/FileUtil');
const { Collection } = require('discord.js');

class CommandStore extends Collection {
  fetch(str) {
    return this.find((c) => c.name.toLowerCase() === str.toLowerCase() || c.aliases.includes(str.toLowerCase()));
  }
}

class CommandLoader extends Loader {
  constructor(client) {
    super(client, true);
    this.commands = new CommandStore();
  }

  async load() {
    await requireDirectory('src/commands', this.loadCommand.bind(this), (x, ...args) => console.error(x.stack, args));
    this.client.commands = this.commands;
    return true;
  }

  loadCommand(Command) {
    const command = new Command(this.client);
    this.commands.set(command.name, command);
  }
}

module.exports = CommandLoader;
