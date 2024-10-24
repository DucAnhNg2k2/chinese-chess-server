import { Controller, Get } from '@nestjs/common';
import { RoomGameManager } from './room/room.manager';
import { UserGameManager } from './user/user.manager';

@Controller('games')
export class GameController {
  constructor(
    private roomManager: RoomGameManager,
    private userManager: UserGameManager,
  ) {}

  @Get('/rooms')
  getRooms() {
    return this.roomManager.getRooms();
  }

  @Get('/players')
  getPlayers() {
    return this.userManager.getUsers();
  }
}
