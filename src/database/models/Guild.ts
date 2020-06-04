/* eslint-disable max-classes-per-file */
import { prop, getModelForClass } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

class Module extends TimeStamps {
  @prop({ default: false })
  public enable!: boolean;

  @prop()
  public id?: string;
}

class StarboardModule extends Module {
  @prop({ default: 3 })
  public minStars!: number;
}

class Guild extends TimeStamps {
  @prop({ required: true, unique: true })
  public id!: string;

  @prop()
  public lang?: string;

  @prop()
  public prefix?: string;

  @prop({ _id: false })
  public autorole!: Module

  @prop({ to: Module, _id: false })
  public logs!: Map<logTypes, Module>

  @prop({ _id: false })
  public starboard!: StarboardModule

  @prop()
  public disableChannels!: string[];
}

export type logTypes = 'GuildMemberAdd' | 'GuildMemberRemove' | 'GuildUpdates' | 'MessageUpdate' | 'UserUpdate' | 'VoiceChannelLogs'
export default getModelForClass(Guild);
