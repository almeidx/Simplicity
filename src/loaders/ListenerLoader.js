'use strict';

const Loader = require('@structures/Loader');
const { requireDirectory } = require('@util/FileUtil');
const Logger = require('@util/Logger');

class ListenerLoader extends Loader {
  constructor(client) {
    super(client, true);
  }

  async load() {
    const logs = [];
    await requireDirectory('src/listeners', (Listener, fileName) => {
      const listener = new Listener(this.client);
      logs.push(fileName);
      this.client.on(fileName, (...args) => listener.on(this.client, ...args));
    }, Logger.error);

    this.client.availableLogs = logs;

    return true;
  }
}

module.exports = ListenerLoader;
