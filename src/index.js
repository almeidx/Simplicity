'use strict';

require('module-alias/register');
require('dotenv').config();

const SimplicityClient = require('@discord/SimplicityClient');
const { CLIENT_OPTIONS } = require('@util/Constants');
const client = new SimplicityClient(CLIENT_OPTIONS);
const Logger = require('@util/Logger');

client.login();
client
  .on('shardError', (error, shardID) => Logger.error(`Shard ${shardID} Error:`, error.stack))
  .on('invalidated', () => {
    Logger.error('The client\'s session is now invalidated.');
    process.exit(1);
  });

process
  .on('unhandledRejection', (error) => Logger.error('Uncaught Promise Error:', error.stack))
  .on('uncaughtException', (error) => {
    Logger.error('Uncaught Exception:', error.stack);
    process.exit(1);
  });
