'use strict';

const { SimplicityClient } = require('./src');
const server = require('./src/api/server');

require('dotenv').config();

const CLIENT_OPTIONS = {
  fetchAllMembers: true,
  disableEveryone: true,
  disabledEvents: ['TYPING_START'],
  partials: ['MESSAGE', 'CHANNEL'],
  presence: {
    activity: {
      name: '@Simplicity help',
      type: 'WATCHING',
    },
  },
};

const client = new SimplicityClient(CLIENT_OPTIONS);
client.login(process.env.DISCORD_TOKEN)
  .then(() => {
    server(client);
    console.log('bot está online!');
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

client
  .on('shardError', (error, shardID) => console.error(`Shard ${shardID} Error:`, error))
  .on('invalidated', () => {
    console.error('The client\'s session is now invalidated.');
    process.exit(1);
  });

process
  .on('unhandledRejection', (error) => console.error('Uncaught Promise Error:', error))
  .on('uncaughtException', (error) => {
    const msg = error.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
    console.error('Uncaught Exception:', msg);
    process.exit(1);
  });
