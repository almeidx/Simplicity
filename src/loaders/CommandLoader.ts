import path from 'path';
import {
  FolderLoader, Command, CommandCollection, SimplicityClient,
} from '../structures';

export default class CommandLoader extends FolderLoader<typeof Command> {
  commands: CommandCollection;

  constructor(client: SimplicityClient) {
    super(client, {
      instanceOf: Command,
      requiredAllFiles: true,
      required: true,
      directory: path.resolve(__dirname, '..', 'commands'),
    });
    this.commands = new CommandCollection();
  }

  async load(): Promise<void> {
    await super.load();
    this.client.commands = this.commands;
  }

  register(command: Command): void {
    this.commands.register(command);
  }
}
