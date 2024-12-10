export interface InviteRoomDto {
  roomId: string;
  invitee: string; // This is the user to invite
  inviter: string; // This is the user who is inviting
}
