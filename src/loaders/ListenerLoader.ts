import path from 'path';
import {
  FolderLoader, Listener, SimplicityClient,
} from '../structures';

export default class ListenerLoader extends FolderLoader<typeof Listener> {
  constructor(client: SimplicityClient) {
    super(client, {
      instanceOf: Listener,
      requiredAllFiles: true,
      required: true,
      directory: path.resolve(__dirname, '..', 'listeners'),
    });
  }

  register(listener: Listener): void {
    this.client.on(listener.event, (...args: any) => listener.exec(...args));
  }
}
