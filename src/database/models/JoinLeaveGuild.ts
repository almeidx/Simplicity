import { Schema, model, Document } from 'mongoose';
import { JoinLeaveGuild, JoinLeaveGuildTypes } from './JoinLeaveGuild.interfaces';

const JoinLeaveGuildSchema = new Schema<JoinLeaveGuild>({
  createAt: { type: Date, required: true },
  guildId: { type: Date, required: true },
  type: { type: String, enum: Object.values(JoinLeaveGuildTypes) },
});

export default model<JoinLeaveGuild & Document>('joinLeaveGuild', JoinLeaveGuildSchema);
