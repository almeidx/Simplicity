import { Client, ClientOptions } from "discord.js";
/**
 * The main hub for interacting with the Discord API, and the starting point for the bot.
 * @extends {Client}
 */
export default class EazeClient extends Client {
    constructor(options?: ClientOptions);
    /**
     * Logs the client in, establishing a websocket connection to Discord.
     * @param {string} [token=process.env.DISCORD_TOKEN] Token of the account to log in with
     * @returns {Promise<string>} Token of the account used
     */
    login(token?: string): Promise<string>;
}
