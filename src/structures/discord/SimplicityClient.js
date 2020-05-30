'use strict';

const config = require('@data/config');
const Loaders = require('@loaders');
const { Logger } = require('@util');
const { Client, Collection } = require('discord.js');

/**
 * Main Client class.
 * @class SimplicityClient
 * @extends {Client}
 */
class SimplicityClient extends Client {
  /**
   * Creates an instance of SimplicityClient.
   * @param {Object} [options={}] The options for the Client.
   */
  constructor(options) {
    super(options);
    this.logger = Logger;
    this.deletedMessages = new Map();
    this.config = config;
  }

  /**
   * Loads all the loader files.
   * @returns {void}
   */
  async loadFiles() {
    for (const Loader of Object.values(Loaders)) {
      const loader = new Loader(this);
      let result;
      try {
        // eslint-disable-next-line no-await-in-loop
        result = await loader.load();
        console.log(`${loader.constructor.name} carregou sem problemas!`);
      } catch (err) {
        console.error('ops', err);
        result = false;
      } finally {
        if (!result && loader.required) process.exit(1);
      }
    }
  }

  /**
   * Login the Client.
   * @param {string} token The API Token.
   * @returns {Promise<string>} The Client after being logged in.
   */
  login(token) {
    this.loadFiles();
    return super.login(token);
  }

  /**
   * Getter for the command categories of the Client.
   * @returns {Collection<category, CommandStore>} A Collection with every category + its respective commands.
   * @readonly
   */
  get categories() {
    return this.commands.reduce((o, command) => {
      if (!o.has(command.category)) o.set(command.category, new Collection());

      o.get(command.category).set(command.name, command);
      return o;
    }, new Collection());
  }
}

module.exports = SimplicityClient;
