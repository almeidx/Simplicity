export default class CommandError extends Error {
  constructor(public Tkey: string, public TOptions?: object, public showUsage?: boolean) {
    super();
  }
}
