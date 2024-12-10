import { Controller, Get, Param } from '@nestjs/common';
import { GameHistoryService } from './game-history.service';
import { User } from 'src/commons/decorators/user.decorator';
import { UserReq } from 'src/commons/UserReq';

@Controller('game-histories')
export class GameHistoryController {
  constructor(private readonly gameHistoryService: GameHistoryService) {}

  @Get()
  list(@User() user: UserReq) {
    return this.gameHistoryService.list(user);
  }

  @Get(':id')
  get(@User() user: UserReq, @Param('id') id: string) {
    return this.gameHistoryService.getById(user, id);
  }
}
