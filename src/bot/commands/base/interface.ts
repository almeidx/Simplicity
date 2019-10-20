import { PermissionString } from 'discord.js';

type categories = 'bot' | 'information' | 'devolepers' | 'utility' | 'configuration' | 'moderation'

export interface CommandOptions {
    name: string,
    category: categories,
    aliases?: string[],
    cooldown?: number,
}

export interface CommandRequirements {
    ownerOnly?: false,
    requireDatabase?: false,
    permissions?: PermissionString[],
    clientPermissions?: PermissionString[],
}

export interface ParamsOptions {}
