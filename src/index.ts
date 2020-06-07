import 'dotenv/config';
import 'tsconfig-paths/register';
import './structures/discord/Structures';

import { Constants } from './util';
import { SimplicityClient } from './structures';
import Logger from './util/Logger';

const client = new SimplicityClient(Constants.CLIENT_OPTIONS);

client.login(String(process.env.DISCORD_TOKEN))
  .catch((error) => Logger.error(error));

client
  .on('shardError', (error, shardID) => Logger.error(`Shard ${shardID} Error:`, error.stack))
  .on('invalidated', () => {
    Logger.error('The client\'s session is now invalidated.');
    process.exit(1);
  });

process
  .on('unhandledRejection', (error: Error) => Logger.error('Uncaught Promise Error:', error.stack))
  .on('uncaughtException', (error: Error) => {
    const msg = error?.stack?.replace(new RegExp(`${__dirname}/`, 'g'), './') ?? error;
    Logger.error('Uncaught Exception:', msg);
    process.exit(1);
  });
