import { IsNotEmpty, IsNumberString } from 'class-validator';

export class UnFriendDto {
  @IsNumberString()
  @IsNotEmpty()
  friendId: string;
}
