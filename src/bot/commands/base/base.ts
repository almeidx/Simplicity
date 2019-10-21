import { PermissionString, Message } from 'discord.js';

export type categories =
    'bot' |
    'information' |
    'devolepers' |
    'utility' |
    'configuration' |
    'moderation'

export interface CommandOptions {
    readonly name: string,
    readonly category: categories,
    readonly aliases?: string[],
    readonly cooldown?: number,
}

export interface CommandRequirements {
    readonly guildOnly?: boolean,
    readonly ownerOnly?: boolean,
    readonly requireDatabase?: boolean,
    readonly userPermissions?: PermissionString[],
    readonly clientPermissions?: PermissionString[],
}

export interface Command extends CommandOptions, CommandRequirements {
    run(message: Message): any
}
