import path from 'path';
import {
  FolderLoader, SimplicityListener, SimplicityClient,
} from '../structures';

export default class ListenerLoader extends FolderLoader<typeof SimplicityListener> {
  constructor(client: SimplicityClient) {
    super(client, {
      instanceOf: SimplicityListener,
      requiredAllFiles: true,
      required: true,
      directory: path.resolve(__dirname, '..', 'listeners'),
    });
  }

  register(listener: SimplicityListener): void {
    this.client.on(listener.event, (...args: any) => listener.exec(...args));
  }
}
