import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserReq } from 'src/commons/UserReq';
import { GameHistoryEntity } from 'src/databases/game-history.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GameHistoryService {
  constructor(
    @InjectRepository(GameHistoryEntity)
    private readonly gameHistoryRepository: Repository<GameHistoryEntity>,
  ) {}

  async list(user: UserReq) {
    const qb = this.gameHistoryRepository.createQueryBuilder('gameHistory');
    const data = await qb.getMany();
    return data;
  }
}
