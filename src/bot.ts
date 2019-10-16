import { config } from 'dotenv';
import SimplicityClient from './SimplicityClient';

config();

const client = new SimplicityClient({
  fetchAllMembers: true,
  disableEveryone: true,
  disabledEvents: ['TYPING_START'],
  presence: {
    activity: {
      name: '@Simplicity help',
      type: 'WATCHING',
    },
  },
});

client.login(process.env.DISCORD_TOKEN)
  .then(() => console.log(`My name is ${client.user.username}!`));
