import { Command, CommandContext, SimplicityClient } from '../../structures';

export default class Ping extends Command {
  /**
   * @param client The client for this command
   */
  constructor(client: SimplicityClient) {
    super(client, 'ping', {
      aliases: ['pong'],
      category: 'bot',
    });
  }

  async run({ channel, client, message }: CommandContext): Promise<void> {
    const ws = Math.ceil(client.ws.ping);
    const msg = await channel.send(`WebSocket: ${ws}ms`);
    await msg.edit(`WebSocket: ${ws}ms | Ping: ${Math.ceil(msg.createdTimestamp - message.createdTimestamp)}ms`);
  }
}
