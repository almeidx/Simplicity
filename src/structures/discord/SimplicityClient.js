'use strict';

const { Client, Collection } = require('discord.js');
const Loaders = require('../../loaders');

class SimplicityClient extends Client {
  constructor(options) {
    super(options);
    this._deleteMessages = new Map();
    this.loadFiles();
  }

  async loadFiles() {
    for (const Loader of Object.values(Loaders)) {
      const loader = new Loader(this);
      let result;
      try {
        // eslint-disable-next-line no-await-in-loop
        result = await loader.load();
      } catch (err) {
        console.error(err);
        result = false;
      } finally {
        if (!result && loader.required) process.exit(1);
      }
    }
  }

  get categories() {
    return this.commands.reduce((o, command) => {
      if (!o.has(command.category)) o.set(command.category, new Collection());

      o.get(command.category).set(command.name, command);
      return o;
    }, new Collection());
  }
}

module.exports = SimplicityClient;
