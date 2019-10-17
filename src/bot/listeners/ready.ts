import SimplicityClient from '../SimplicityClient';

function onReady<SimplicityClient>(): void {
  console.log(`My name is ${this.user.username}!`);
}

export default (client: SimplicityClient) => client.on('ready', onReady);
