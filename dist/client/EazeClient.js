"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
// import { ResolveResponse } from '../command/arguments/Argument';
// import CommandContext from '../command/CommandContext';
// export interface EazeClientOptions {
//   defaultArgumentOptions?: {
//     missingError?: ResolveResponse;
//     invalidError?: ResolveResponse;
//   };
//   customContext?: typeof CommandContext;
// }
/**
 * The main hub for interacting with the Discord API, and the starting point for the bot.
 * @extends {Client}
 */
class EazeClient extends discord_js_1.Client {
    // defaultArgumentOptions?: {
    //   missingError?: ResolveResponse;
    //   invalidError?: ResolveResponse;
    // };
    // customContext?: typeof CommandContext;
    constructor(
    /* eazeOptions?: EazeClientOptions, */ options = {}) {
        super(options);
        // this.defaultArgumentOptions = eazeOptions?.defaultArgumentOptions;
        // this.customContext = eazeOptions?.customContext;
    }
    /**
     * Logs the client in, establishing a websocket connection to Discord.
     * @param {string} [token=process.env.DISCORD_TOKEN] Token of the account to log in with
     * @returns {Promise<string>} Token of the account used
     */
    login(token) {
        return super.login(token);
    }
}
exports.default = EazeClient;
