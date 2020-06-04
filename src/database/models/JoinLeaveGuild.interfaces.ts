export enum JoinLeaveGuildTypes {
  JOIN = 'JOIN',
  LEAVE = 'LEAVE',
}

export interface JoinLeaveGuild {
  eventAt: Date;
  guildId: string;
  type: JoinLeaveGuildTypes;
}
