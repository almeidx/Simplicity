/* eslint-disable @typescript-eslint/ban-types */
import Loader from './Loader';
import SimplicityClient from './discord/SimplicityClient';
import FileUtil from '../util/FileUtil';
import Logger from '../util/Logger';

export default abstract class FolderLoader<A extends Function> extends Loader {
  directory: string;
  requiredAllFiles: boolean;
  instanceOf: A;

  constructor(
    client: SimplicityClient,
    opts: { directory: string, requiredAllFiles?: boolean, required?: boolean, instanceOf: A },
  ) {
    super(client, !!opts.required);
    this.directory = opts.directory;
    this.requiredAllFiles = !!opts.requiredAllFiles;
    this.instanceOf = opts.instanceOf;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  abstract register(required: any): any;

  async load(): Promise<void> {
    await FileUtil.requireDirectory(this.directory, true, (error, Instance, fileName) => {
      if (error) {
        Logger.error(fileName, error);
        if (this.requiredAllFiles) {
          process.exit(0);
        }
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const instance = new Instance(this.client);
      this.register(instance);
    });
  }
}
