'use strict';

require('module-alias/register');
require('dotenv').config();

const SimplicityClient = require('@discord/SimplicityClient');
const { CLIENT_OPTIONS } = require('@util/Constants');
const client = new SimplicityClient(CLIENT_OPTIONS);

client.login();
client
  .on('shardError', (error, shardID) => console.error(`Shard ${shardID} Error:`, error.stack))
  .on('invalidated', () => {
    console.error('The client\'s session is now invalidated.');
    process.exit(1);
  });

process
  .on('unhandledRejection', (error) => console.error('Uncaught Promise Error:', error.stack))
  .on('uncaughtException', (error) => {
    const msg = error.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
    console.error('Uncaught Exception:', msg);
    process.exit(1);
  });
