import { PermissionString } from 'discord.js';

type categories = 'bot' | 'information' | 'devolepers' | 'utility' | 'configuration' | 'moderation'

export interface CommandOptions {
    name: string,
    category: categories,
    aliases?: string[],
    cooldown?: number,
}

export interface CommandRequirements {
    guildOnly?: boolean,
    ownerOnly?: boolean,
    requireDatabase?: boolean,
    userPermissions?: PermissionString[],
    clientPermissions?: PermissionString[],
}

export interface ParamsOptions {}

export type errorBases = 'cooldown' | 'arguments' | 'requirements';
