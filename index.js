'use strict';

const { SimplicityClient } = require('./src');
require('dotenv').config();

const CLIENT_OPTIONS = {
  fetchAllMembers: true,
  disableEveryone: true,
  disabledEvents: ['TYPING_START'],
  presence: {
    activity: {
      name: '@Simplicity help',
      type: 'WATCHING',
    },
  },
  ws: {
    large_threshold: 1000,
  },
};

const client = new SimplicityClient(CLIENT_OPTIONS);
client.login().catch((error) => {
  console.error(error);
  process.exit(1);
});

client
  .on('shardReady', (id) => console.log(`Shard ${id} is ready`))
  .on('shardDisconnected', (event, id) => console.error(`Shard ${id} has been disconnected.`, event))
  .on('shardReconnecting', (id) => console.log(`Shard ${id} has reconnected.`))
  .on('shardResumed', (id, replayedEvents) => console.log(`Shard ${id} has resumed. Replayed events:`, replayedEvents))
  .on('shardError', (error, shardID) => console.error(`Shard ${shardID} Error:`, error))
  .on('warn', (info) => console.log(info))
  .on('debug', (info) => console.log(info))
  .on('invalidated', () => {
    console.log('The client\'s session is now invalidated.');
    process.exit(1);
  });

process
  .on('unhandledRejection', (error) => console.error('Uncaught Promise Error:', error))
  .on('beforeExit', (code) => console.log('Process beforeExit event with code: ', code))
  .on('exit', (code) => console.log('Process exit event with code: ', code))
  .on('disconnect', () => console.log('Process is disconnecting'))
  .on('uncaughtException', (error) => {
    const msg = error.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
    console.error('Uncaught Exception:', msg);
    process.exit(1);
  });
