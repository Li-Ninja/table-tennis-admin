import { DoublePlayerStatusEnum } from '@/enums/common.enum';

export interface Player {
  id: number;
  name: string;
  score: number;
  isMan: boolean;
  isRightHand: boolean;
  racketType: number;
  forehandRubberType: number;
  backhandRubberType: number;
  rank: number;
  resultCount: number;
  resultCountByYearly: number;
  winningCount: number;
  updateDateTime: Date;
  latestResultDateTime: Date;
  isOnLeave: boolean;
}

export interface DoublePlayer {
  id: number;
  teamName: string;
  player_id_1: number;
  player_id_2: number;
  player_name_1: string;
  player_name_2: string;
  score: number;
  rank: number;
  resultCount: number;
  resultCountByYearly: number;
  winningCount: number;
  updateDateTime: Date;
  latestResultDateTime: Date;
  status: DoublePlayerStatusEnum;
}

export interface PlayerPost {
  name: string;
}
