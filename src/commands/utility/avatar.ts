import {
  Command, CommandContext, SimplicityClient, Embed,
} from '../../structures';

export default class Avatar extends Command {
  /**
   * @param client The client for this command
   */
  constructor(client: SimplicityClient) {
    super(client, 'avatar', {
      aliases: ['av', 'pfp'],
      args: [
        {
          type: 'user',
        },
      ],
      category: 'utility',
    });
  }

  async run({ author, send, t }: CommandContext, user = author): Promise<void> {
    const embed = new Embed(author, { autoAuthor: false, t })
      .setAuthor(user)
      .setImage(user.displayAvatarURL({ dynamic: true, format: 'png', size: 4096 }));
    await send(embed);
  }
}
