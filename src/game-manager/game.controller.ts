import { Controller, Get } from '@nestjs/common';
import { RoomManager } from './room/room.manager';
import { UserGameManager } from './user/user.manager';

@Controller('games')
export class GameController {
  constructor(
    private roomManager: RoomManager,
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
