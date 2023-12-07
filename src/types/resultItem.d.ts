import { Result } from './result';

export interface ResultItem {
  result_Id: Result['id'];
  matchIndex: number;
  scoreA: number;
  scoreB: number;
}

export type ResultItemGet = Pick<ResultItem, 'result_Id'>;

export interface ResultItemPost extends ResultItem, Pick<Result, 'player_id_a_1' | 'player_id_a_2' | 'player_id_b_1' | 'player_id_b_2'> { }

export type ResultItemPut = ResultItemPost;
