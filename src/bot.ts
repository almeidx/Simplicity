import { config } from 'dotenv';
import SimplicityClient from './bot/client/SimplicityClient';

import { requireDirectory } from './utils/FileUtils';

config();

const client = new SimplicityClient();

client.login(process.env.DISCORD_TOKEN);
