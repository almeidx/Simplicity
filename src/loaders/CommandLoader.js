'use strict';

const { requireDirectory } = require('@utils/FileUtils');
const { Loader } = require('@structures');
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
    await requireDirectory('src/commands', this.loadSuccess.bind(this), (x, ...args) => console.error(x.stack, args));
    this.client.commands = this.commands;
    return true;
  }

  loadSuccess(Command, fileName, folderName) {
    const command = new Command(this.client);
    command.name = fileName;
    if (folderName !== 'commands' && command.category === 'none') command.category = folderName;
    this.commands.set(fileName, command);
  }
}

module.exports = CommandLoader;
