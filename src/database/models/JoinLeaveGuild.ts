import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { prop, getModelForClass } from '@typegoose/typegoose';

export enum JoinLeaveGuildTypes {
  JOIN = 'JOIN',
  LEAVE = 'LEAVE',
}

class JoinLeaveGuild extends Base {
  @prop({ required: true })
  public eventAt!: Date;

  @prop({ required: true })
  public guildId!: string;

  @prop({ enum: JoinLeaveGuildTypes, type: String, required: true })
  public type!:JoinLeaveGuildTypes
}

export default getModelForClass(JoinLeaveGuild);
