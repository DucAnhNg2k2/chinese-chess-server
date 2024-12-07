import { IsNotEmpty, IsNumberString } from 'class-validator';

export class AddFriendDto {
  @IsNumberString()
  @IsNotEmpty()
  friendId: string;
}
