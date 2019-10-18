import SimplicityClient from '../client/SimplicityClient';

export const name = 'ready';
export function handle<SimplicityClient>(): void {
  this.logger.log(`My name is ${this.user.username}!`);
}
