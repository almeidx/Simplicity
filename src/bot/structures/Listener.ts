/* eslint-disable class-methods-use-this */
import SimplicityClient from '../client/SimplicityClient';

type eventType = 'rateLimit' |
 'ready' |
 'guildCreate' |
 'guildDelete' |
 'guildUpdate' |
 'guildUnavailable' |
 'guildAvailable' |
 'guildMemberAdd' |
 'guildMemberRemove' |
 'guildMemberUpdate' |
 'guildMemberAvailable' |
 'guildMemberSpeaking' |
 'guildMembersChunk' |
 'guildIntegrationsUpdate' |
 'roleCreate' |
 'roleDelete' |
 'roleUpdate' |
 'emojiCreate' |
 'emojiDelete' |
 'emojiUpdate' |
 'guildBanAdd' |
 'guildBanRemove' |
 'channelCreate' |
 'channelDelete' |
 'channelUpdate' |
 'channelPinsUpdate' |
 'message' |
 'messageDelete' |
 'messageUpdate' |
 'messageDeleteBulk' |
 'messageReactionAdd' |
 'messageReactionRemove' |
 'messageReactionRemoveAll' |
 'userUpdate' |
 'presenceUpdate' |
 'voiceServerUpdate' |
 'voiceStateUpdate' |
 'subscribe' |
 'unsubscribe' |
 'typingStart' |
 'typingStop' |
 'webhookUpdate' |
 'error' |
 'warn' |
 'debug' |
 'shardDisconnect' |
 'shardError' |
 'shardReconnecting' |
 'shardReady' |
 'shardResume' |
 'invalidated' |
 'raw'

type emitters = 'once' | 'on'

export default class Listener {
    public readonly name: eventType

    public readonly emitter: emitters

    private bot: SimplicityClient

    public constructor(name?: eventType, emitter: emitters = 'on') {
      this.name = name;
      this.emitter = emitter;
    }

    public get client() {
      return this.bot;
    }

    public setClient(client: SimplicityClient) {
      this.bot = client;
    }

    public handle(..._args: any): any {}
}
