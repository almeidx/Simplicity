import {
  Command, CommandContext, SimplicityClient, SimplicityEmbed,
} from '../../structures';

export default class Avatar extends Command {
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

  async run({
    author, send, t,
  }: CommandContext, user = author): Promise<void> {
    const embed = new SimplicityEmbed(author, { autoAuthor: false, t })
      .setAuthor(user)
      .setImage(user.displayAvatarURL({ dynamic: true, format: 'png', size: 4096 }));
    await send(embed);
  }
}
