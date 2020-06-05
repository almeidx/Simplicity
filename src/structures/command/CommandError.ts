export default class CommandError extends Error {
  notEmbed: boolean;
  showUsage: boolean;

  constructor(message: string, options: { showUsage?: boolean, notEmbed?: boolean } = {}) {
    super(message);
    this.showUsage = !!options.showUsage;
    this.notEmbed = !!options.notEmbed;
  }
}
