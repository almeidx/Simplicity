import { Message, Guild } from 'discord.js';
import Command from '../base/Command';

export default class ServerInfo extends Command {
  constructor() {
    super({
      name: 'serverinfo',
      category: 'information',
      aliases: ['si', 'server', 'svinfo', 'sv', 'guild', 'serverinformation', 'svinformation'],
    }, {}, [
      {
        type: 'boolean',
        flags: ['r', 'roles'],
      },
    ]);
  }

  async run(message: Message, onlyRoles: boolean) {
    const { guild } = message;
    if (guild.memberCount !== guild.members.size || guild.large) await guild.members.fetch();

    if (onlyRoles) {
      return message.send('colocou role');
    }

    message.send('n colocou role');
  }
}
