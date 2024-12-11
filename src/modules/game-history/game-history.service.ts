import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserReq } from 'src/commons/UserReq';
import { GameHistoryEntity } from 'src/databases/game-history.entity';
import { UserProfileEntity } from 'src/databases/user-profile.entity';
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

  async getById(userReq: UserReq, id: string) {
    const qb = this.gameHistoryRepository
      .createQueryBuilder('gameHistory')
      .leftJoinAndSelect('gameHistory.gameMoves', 'gameMoves')
      .leftJoinAndMapOne(
        'gameHistory.player1',
        UserProfileEntity,
        'player1',
        'player1.userId = gameHistory.player1Id',
      )
      .leftJoinAndMapOne(
        'gameHistory.player2',
        UserProfileEntity,
        'player2',
        'player2.userId = gameHistory.player2Id',
      )
      .andWhere('gameHistory.id = :id', { id });

    const data = await qb.getOne();
    data.gameMoves.forEach((gameMove) => {
      delete gameMove['gameHistoryId'];
      delete gameMove['id'];
      delete gameMove['playerId'];
      delete gameMove['piece'];
    });
    return data;
  }
}
