import { config } from 'dotenv';
import SimplicityClient from './bot/SimplicityClient';

import { requireDirectory } from './utils/FileUtils';

config();

const client = new SimplicityClient();


requireDirectory('src/bot/listeners', (error, start) => {
  console.log(error, start);
  if (error) {
    console.error(error);
    process.exit(1);
  }

  try {
    console.log(start);
    start(client);
  } catch (err) {
    console.error(err);
  }
});

client.login(process.env.DISCORD_TOKEN);
